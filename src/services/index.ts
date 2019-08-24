import express from 'express'
import goDaddy from './goDaddy'
const services = express.Router()
import fetch from '../helpers/httpRequest'

const getDomains = async (provider: string) => {
  switch (provider) {
    case 'GODADDY':
      const { service, getDomains, options } = goDaddy
      return fetch(`${service + getDomains}`, options)
    default:
      return 'Provider not supported yet'
  }
}

services.get('/domains', (_, res) => res.send('List of providers or whatever'))
services.get('/domains/:provider', async (req, res) => {
  const { provider } = req.params
  const data = await getDomains(provider.toUpperCase())
  res.json(data) // Data send to view provider ?
})

export { services }
