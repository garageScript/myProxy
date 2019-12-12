import express from 'express'
import fs from 'fs'
import environment from '../helpers/environment'
import { getMappingByDomain } from '../lib/data'

const logsRouter = express.Router()
const { isProduction } = environment

logsRouter.get('/err/:domain', (req, res) => {
  const { domain } = req.params

  if (isProduction()) {
    // Only search for domain when running in production. The test does not
    // require a valid domain since it only verifies the endpoint
    const { fullDomain } = getMappingByDomain(domain)
    // Pipes the error log files to res
    res.setHeader('content-type', 'text/plain')
    fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-err.log`).pipe(
      res
    )
  } else {
    res.send('OK')
  }
})

logsRouter.get('/out/:domain', (req, res) => {
  const { domain } = req.params

  if (isProduction()) {
    // Only search for domain when running in production. The test does not
    // require a valid domain since it only verifies the endpoint
    const { fullDomain } = getMappingByDomain(domain)
    // Pipes the output log file to res. Console.Log from your app will appear here
    res.setHeader('content-type', 'text/plain')
    fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-out.log`).pipe(
      res
    )
  } else {
    res.send('OK')
  }
})

export default logsRouter
