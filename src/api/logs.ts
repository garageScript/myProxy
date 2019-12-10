import express from 'express'
import fs from 'fs'
import { getMappingByDomain } from '../lib/data'

const logsRouter = express.Router()

logsRouter.get('/:domain/err', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  res.setHeader('content-type', 'text/plain')
  fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-err.log`).pipe(res)
})

logsRouter.get('/:domain/out', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  res.setHeader('content-type', 'text/plain')
  fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-out.log`).pipe(res)
})

export default logsRouter
