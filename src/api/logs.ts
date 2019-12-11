import express from 'express'
import fs from 'fs'
import environment from '../helpers/environment'
import { getMappingByDomain } from '../lib/data'

const logsRouter = express.Router()
const { isProduction } = environment

logsRouter.get('/err/:domain', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  if (!isProduction()) return res.send('OK')

  res.setHeader('content-type', 'text/plain')
  fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-err.log`).pipe(res)
})

logsRouter.get('/out/:domain', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  if (!isProduction()) return res.send('OK')

  res.setHeader('content-type', 'text/plain')
  fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-out.log`).pipe(res)
})

export default logsRouter
