/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import {
  setData,
  getMappings,
  getMappingByDomain,
  getMappingById,
  deleteDomain,
  updateDomain
} from '../lib/data'
import { Mapping } from '../types/general'
import { getGitUserId, getGitGroupId } from '../helpers/getGitUser'
import environment from '../helpers/environment'
import {
  getContainersList,
  createContainer,
  startContainer,
  stopContainer,
  removeContainer,
  inspectContainer
} from '../helpers/docker'
import { DockerError } from '../types/docker'
const mappingRouter = express.Router()
const exec = util.promisify(cp.exec)
const getNextPort = (map, start = 3002): number => {
  if (!map[start]) return start
  if (map[start]) start += 1
  return getNextPort(map, start)
}

const { WORKPATH, isProduction } = environment

mappingRouter.post('/', async (req, res) => {
  const domainKeys = getMappings()
  if (parseInt(req.body.port) < 3001) {
    return res.status(400).json({ message: 'Port cannot be smaller than 3001' })
  }
  const fullDomain = req.body.subDomain
    ? `${req.body.subDomain}.${req.body.domain}`.toLowerCase()
    : `${req.body.domain}`.toLowerCase()
  const existingSubDomain = getMappingByDomain(fullDomain)
  if (existingSubDomain)
    return res.status(400).json({
      message: 'Subdomain already exists'
    })
  const map = domainKeys.reduce((acc, e) => {
    acc[e.port] = true
    return acc
  }, {})
  const portCounter = getNextPort(map)
  const port = parseInt(req.body.port || portCounter, 10)
  const scriptPath = '.scripts'

  // Create a new container and get the id
  const id = isProduction() ? await createContainer(fullDomain, port) : uuid4()

  const respond = (): void => {
    const mappingObject: Mapping = {
      domain: req.body.domain.toLowerCase(),
      subDomain: req.body.subDomain.toLowerCase(),
      port: port.toString(),
      ip: req.body.ip || '127.0.0.1',
      id,
      gitLink: `git@${req.body.domain}:${WORKPATH}/${fullDomain}`,
      fullDomain
    }
    domainKeys.push(mappingObject)
    setData('mappings', domainKeys)
    res.json(mappingObject)
  }

  if (!isProduction()) {
    return respond()
  }

  // get user and group id to execute the commands with the correct permissions
  const gitUserId = await getGitUserId()
  const gitGroupId = await getGitGroupId()

  exec(
    `
      umask 002
      cd ${WORKPATH}
      mkdir ${fullDomain}
      git init ${fullDomain}
      cp ${scriptPath}/post-receive ${fullDomain}/.git/hooks/
      cp ${scriptPath}/pre-receive ${fullDomain}/.git/hooks/
      cp ${scriptPath}/.gitignore ${fullDomain}/.gitignore
      cd ${fullDomain}
      git config user.email "root@ipaddress"
      git config user.name "user"
      git add .
      git commit -m "Initial Commit"
      `,
    { uid: gitUserId, gid: gitGroupId }
  )
    .then(() => {
      respond()
    })
    .catch(error => console.error(`mappingRouter.post exec: ${error}`))
})

mappingRouter.get('/', async (req, res) => {
  const domains = getMappings()

  if (!isProduction())
    return res.json(domains.map(el => ({ ...el, status: 'not started' })))

  const data = await getContainersList()
  const statusData = data.reduce(
    (statusObj, el) => ({
      ...statusObj,
      [el.Names[0].replace('/', '')]: el.State
    }),
    {}
  )
  const fullDomainStatusMapping = domains.map(el => {
    if (statusData[el.fullDomain]) {
      return { ...el, status: statusData[el.fullDomain] }
    } else {
      return { ...el, status: 'not started' }
    }
  })

  res.json(fullDomainStatusMapping)
})

mappingRouter.delete('/:id', async (req, res) => {
  const deletedDomain = getMappingById(req.params.id)
  deleteDomain(deletedDomain.fullDomain)
  if (!isProduction()) return res.json(deletedDomain)

  // stop and remove container
  removeContainer(deletedDomain.fullDomain)
    .then(() => {
      // delete the domain folder
      exec(`
        cd ${WORKPATH}
        rm -rf ${deletedDomain.fullDomain}
      `).then(() => {
        res.json(deletedDomain)
      })
    })
    .catch(err => res.status(err.statusCode).json(err.json))
})

mappingRouter.get('/:id', (req, res) => {
  const foundDomain = getMappingById(req.params.id)
  res.json(foundDomain || {})
})

mappingRouter.get('/:id/start', (req, res) => {
  const { id } = req.params
  startContainer(id)
    .then(() => res.sendStatus(204))
    .catch((err: DockerError) => res.status(err.statusCode).json(err.json))
})

mappingRouter.get('/:id/stop', (req, res) => {
  const { id } = req.params
  stopContainer(id)
    .then(() => res.sendStatus(204))
    .catch((err: DockerError) => res.status(err.statusCode).json(err.json))
})

mappingRouter.get('/:fullDomain/environment', (req, res) => {
  const { fullDomain } = req.params
  inspectContainer(fullDomain)
    .then(info => {
      const envVars = info.Config.Env
      const defaultEnvs = new Set([
        'NODE_ENV',
        'PORT',
        'PATH',
        'NODE_VERSION',
        'YARN_VERSION'
      ])
      const nonDefaultEnvs = envVars.reduce((acc, envVar) => {
        const [name, value] = envVar.split('=')
        if (!defaultEnvs.has(name)) {
          acc[name] = value
        }
        return acc
      }, {})
      res.json({ variables: nonDefaultEnvs })
    })
    .catch((err: DockerError) => res.status(err.statusCode).json(err.json))
})

mappingRouter.put('/:fullDomain/environment', (req, res) => {
  const { fullDomain } = req.params
  const { variables } = req.body
  if (Object.entries(variables).some(([name, value]) => !name || !value)) {
    return res.status(400).json({ message: 'Fields must not be blank.' })
  }
  // convert to the format Docker expects: NAME=VALUE
  const envVars = Object.entries(variables).map(
    ([name, value]) => `${name}=${value}`
  )
  const mapping = getMappingByDomain(fullDomain)
  removeContainer(fullDomain)
    .then(() => createContainer(fullDomain, Number(mapping.port), envVars))
    .then(id => {
      // since docker generates a new ID for the container
      // the domain record needs to be updated
      mapping.id = id
      updateDomain(fullDomain, mapping)
      return startContainer(id)
    })
    .then(() => res.sendStatus(201))
    .catch((err: DockerError) => res.status(err.statusCode).json(err.json))
})

export default mappingRouter
