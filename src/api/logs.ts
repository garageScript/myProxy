import express from 'express'
// import environment from '../helpers/environment'
import fs from 'fs'
import { getMappingByDomain } from '../lib/data'

// const { isProduction } = environment

const logsRouter = express.Router()

logsRouter.get('/:domain', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  res.setHeader('content-type', 'text/plain')
  fs.readdir('/home/myproxy/.pm2/logs', (err, files) => {
    if (err) res.end({ error: err })
    const re = new RegExp(`${fullDomain}-error-\\d.log`, 'g')
    const matches = files.filter(file => file.match(re))
    // This loops through matches to find latest log file
    const file = matches.reduce(
      (latest, current) => (latest < current ? current : latest),
      ''
    )
    fs.createReadStream(`/home/myproxy/.pm2/logs/${file}`).pipe(res)
  })
})

export default logsRouter
