import express from 'express'
import uuid4 from 'uuid/v4'
import { setData, getMappings } from './lib/data'
import { Mapping } from './types/general'
const mappingRouter = express.Router()

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

export default mappingRouter
