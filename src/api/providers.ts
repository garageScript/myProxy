import express from 'express'
import * as goDaddy from '../providers/goDaddy'
const providers = express.Router()

providers.get('/', async (_, res) => {
  const data = await Promise.all([goDaddy.getDomains()])
  return res.json(data) // Data send to view providers ?
})

export default providers
