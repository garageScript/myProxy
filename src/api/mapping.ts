import express from 'express'
import uuid4 from 'uuid/v4'
import util from 'util'
import cp from 'child_process'
import path from 'path'
import fs from 'fs'
import { setData, getMappings } from './lib/data'
import { Mapping } from './types/general'
const mappingRouter = express.Router()
const exec = util.promisify(cp.execSync)

mappingRouter.post('/', (req, res) => {
  const domainKeys = getMappings()
  const mappingObject: Mapping = {
    domain: req.body.domain,
    port: req.body.port,
    ip: req.body.ip,
    id: uuid4()
  }
  domainKeys.push(mappingObject)
  setData('mappings', domainKeys)
  
  // WIP: Move to a script folder
  const projectFolder = `${path.join(__dirname, '../../projects')}/${req.body.domain}`
  exec(`mkdir ${projectFolder}`)
  exec(`git init ${projectFolder}`)
  const data = `
    #!/bin/sh
    cd ..
    GIT_DIR='.git'
    unmask 002 && git reset --hard
  `
  fs.writeFile(`${projectFolder}/.git/hooks/post-recieve`, data, (err) => {
    if(err) return console.log(err)
    exec(`chmod +x ${projectFolder}/.git/hooks/post-recieve`)
  })
  res.json(mappingObject)
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
