/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import path from 'path'
import { setData, getMappings } from './lib/data'
import { Mapping } from './types/general'
const mappingRouter = express.Router()
const exec = util.promisify(cp.exec)

mappingRouter.post('/', (req, res) => {
  const domainKeys = getMappings()
  const mappingObject: Mapping = {
    domain: req.body.domain,
    subDomain: req.body.subDomain,
    port: req.body.port,
    ip: req.body.ip,
    id: uuid4()
  }
  domainKeys.push(mappingObject)
  setData('mappings', domainKeys)
  const projectFolder = `${req.body.domain + req.body.subDomain}`
  const prodConfig = {
    apps: [
      {
        name: `${projectFolder}`,
        script: './build/app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env_production: {
          NODE_ENV: 'production',
          PORT: parseInt(req.body.port, 10)
        }
      }
    ]
  }
  const projectPath = '~/projects'
  exec(`
    mkdir -p ${projectPath}
    mkdir ${projectPath}/${projectFolder}
    git init ${projectPath}/${projectFolder}
    cp ${path.join(
    __dirname,
    '../../scripts'
  )}/post-receive ${projectPath}/${projectFolder}/.git/hooks/
    cd ${projectPath}/${projectFolder}
    echo 'module.exports = ${JSON.stringify(prodConfig)}' > deploy.config.js
    git add .
    git commit -m "Initial Commit"
    git checkout -b prod`).then(() => {
    res.json(mappingObject)
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

export default mappingRouter
