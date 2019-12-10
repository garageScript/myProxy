import express from 'express'
import fs from 'fs'
import { getMappingByDomain } from '../lib/data'

const logsRouter = express.Router()

logsRouter.get('/:domain', (req, res) => {
  const { domain } = req.params
  const { fullDomain } = getMappingByDomain(domain)

  res.setHeader('content-type', 'text/plain')
  fs.readdir('/home/myproxy/.pm2/logs', (err, files) => {
    if (err) return res.status(500).send({ error: err })
    const re = new RegExp(`^${fullDomain}-error-\\d.log`, 'g')
    const matches = files.filter(file => file.match(re))
    /*
        PM2 logs file as domain-error-#.log. When the user
        first creates the domain it would be domain-error-0.log.
        However, when the user deletes the app and recreate the app
        using the same name, the error log would be domain-error-1.log
        The code below always ensures the current log file is being 
        fetched.
    */
    const file = matches.reduce((latest, current) =>
      latest < current ? current : latest
    )
    fs.createReadStream(`/home/myproxy/.pm2/logs/${file}`).pipe(res)
  })
})

export default logsRouter
