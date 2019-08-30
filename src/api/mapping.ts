import express from 'express'
import uuid4 from 'uuid/v4'
const mappingRouter = express.Router()
const list =[]

mappingRouter.post('/mappings', (req, res) =>{
  const domainObject = {
    'domain': req.body.domain,
    'port' : req.body.port,
    'ip' : req.body.ip,
    'id' : uuid4()
  }
  list.push(domainObject)
  res.json(domainObject)
})

export default mappingRouter 
