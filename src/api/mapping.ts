import express from 'express'
import uuid4 from 'uuid/v4'
import { setData, getData, getMappings } from './lib/data'
import { Mapping } from './types/general' 
const mappingRouter = express.Router()

mappingRouter.post('/', (req, res) =>{
  const domainKeys = getMappings()
  const mappingObject: Mapping = {
    'domain': req.body.domain,
    'port' : req.body.portValue,
    'ip' : req.body.ip,
    'id' : uuid4()
  }
  domainKeys.push(mappingObject)
  setData('mappings', domainKeys)
  res.json(mappingObject)
})


export default mappingRouter 
