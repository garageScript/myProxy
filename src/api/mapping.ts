import express from 'express'
import uuid4 from 'uuid/v4'
import { setData, getData } from './lib/data'
const mappingRouter = express.Router()

mappingRouter.post('/', (req, res) => {
  const domainKeys = getData('domains') || []
  const domainObject = {
    domain: req.body.domain,
    port: req.body.port,
    ip: req.body.ip,
    id: uuid4()
  }
  domainKeys.push(domainObject)
  setData('domains', domainKeys)
  res.json(domainObject)
})

export default mappingRouter
