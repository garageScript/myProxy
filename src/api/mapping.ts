/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import { setData, getMappings } from '../lib/data'
import { Mapping } from '../types/general'
const mappingRouter = express.Router()
const exec = util.promisify(cp.exec)
const getNextPort = (map, start = 3002): number => {
  if (!map[start]) return start
  if (map[start]) start += 1
  return getNextPort(map, start)
}

mappingRouter.post('/', (req, res) => {
  const domainKeys = getMappings()
  if (parseInt(req.body.port) < 3001) {
    return res.status(400).json({ message: 'Port cannot be smaller than 3001' })
  }
  const map = domainKeys.reduce((acc, e) => {
    acc[e.port] = true
    return acc
  }, {})
  const portCounter = getNextPort(map)
  const fullDomain = `${req.body.subDomain}.${req.body.domain}`
  const prodConfig = {
    apps: [
      {
        name: fullDomain,
        script: 'npm',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env_production: {
          NODE_ENV: 'production',
          PORT: parseInt(req.body.port || portCounter, 10)
        }
      }
    ]
  }
  const projectPath = '/home/git'
  const scriptPath = '.scripts'

  const respond = () => {
    const mappingObject: Mapping = {
      domain: req.body.domain,
      subDomain: req.body.subDomain,
      port: req.body.port || `${portCounter}`,
      ip: req.body.ip || '127.0.0.1',
      id: uuid4(),
      gitLink: `git@${req.body.domain}:${projectPath}/${fullDomain}`,
      fullDomain
    }
    domainKeys.push(mappingObject)
    setData('mappings', domainKeys)
    res.json(mappingObject)
  }

  if (process.env.NODE_ENV !== 'production') {
    return respond()
  }

  exec('id -u git').then(result => {
    exec(
      `
      cd ${projectPath}
      mkdir ${fullDomain}
      git init ${fullDomain}
      cp ${scriptPath}/post-receive ${fullDomain}/.git/hooks/
      cp ${scriptPath}/pre-receive ${fullDomain}/.git/hooks/
      cd ${fullDomain}
      git config user.email "root@ipaddress"
      git config user.name "user"
      echo 'module.exports = ${JSON.stringify(prodConfig)}' > deploy.config.js
      git add .
      git commit -m "Initial Commit"
      `,
      { uid: parseInt(result.stdout) }
    ).then(() => {
      respond()
    })
  })
})

mappingRouter.get('/', (req, res) => {
  const domains = getMappings()
  res.json(domains)
})

mappingRouter.delete('/delete/:id', (req, res) => {
  const domains = getMappings()
  const deletedDomain = domains.find(e => e.id === req.params.id)
  const updatedDomains = domains.filter(e => {
    return e.id !== req.params.id
  })
  setData('mappings', updatedDomains)
  res.json(deletedDomain)
})

mappingRouter.patch('/edit/:id', (req, res) => {
  const domains = getMappings()
  const domainList = domains.map((element: Mapping) => {
    if (element.id === req.params.id) {
      if (req.body.domain) element.domain = req.body.domain
      if (req.body.subDomain) element.subDomain = req.body.subDomain
      if (req.body.port) element.port = req.body.port
      if (req.body.ip) element.ip = req.body.ip
    }
    return element
  })
  setData('mappings', domainList)
  const updatedDomain = domains.find(
    (element: Mapping) => element.id === req.params.id
  )
  res.json(updatedDomain)
})

mappingRouter.get('/download', (req, res) => {
  const filePath = `/home/git/${req.query.fullDomain}/deploy.config.js`
  res.setHeader('Content-disposition', 'attachment; filename=deploy.config.js')
  res.setHeader('Content-type', 'application/javascript')
  res.download(filePath, err => {
    console.log('Failed to download file', err)
  })
})

export default mappingRouter
