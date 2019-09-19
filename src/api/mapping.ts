/* eslint @typescript-eslint/camelcase: 0 */
import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import path from 'path'
import { setData, getMappings } from '../lib/data'
import { Mapping } from '../types/general'
const mappingRouter = express.Router()
const exec = util.promisify(cp.exec)

mappingRouter.post('/', (req, res) => {
  const domainKeys = getMappings()
  const sortedKeys = domainKeys.sort((a,b) =>parseInt(a.port) - parseInt(b.port))
  let portCounter = 3002
  if(req.body.port === ''){
    sortedKeys.forEach((e) => {
      if(e.port === portCounter.toString()) portCounter += 1
    })
  }
  const mappingObject: Mapping = {
    domain: req.body.domain,
    subDomain: req.body.subDomain,
    port: req.body.port || `${portCounter}`,
    ip: req.body.ip || '127.0.0.1',
    id: uuid4()
  }
  domainKeys.push(mappingObject)
  setData('mappings', domainKeys)
  const fullDomain = `${req.body.subDomain}.${req.body.domain}`
  const prodConfig = {
    apps: [
      {
        name: fullDomain,
        script: './app.js',
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
  const scriptPath = path.join(__dirname, '../../scripts')
  exec(`
    mkdir -p ${projectPath}
    mkdir ${projectPath}/${fullDomain}
    git init ${projectPath}/${fullDomain}
    cp ${scriptPath}/post-receive ${projectPath}/${fullDomain}/.git/hooks/
    cp ${scriptPath}/pre-receive ${projectPath}/${fullDomain}/.git/hooks/
    cd ${projectPath}/${fullDomain}
    git config user.email "root@ipaddress"
    git config user.name "user"
    echo 'module.exports = ${JSON.stringify(prodConfig)}' > deploy.config.js
    git add .
    git commit -m "Initial Commit"`).then(() => {
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
