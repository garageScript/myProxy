import express from 'express'
// import environment from '../helpers/environment'
import fs from 'fs'
import { getMappingById } from '../lib/data'

// const { isProduction } = environment

const logsRouter = express.Router()

logsRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const { fullDomain } = getMappingById(id)

  res.setHeader('content-type', 'text/plain')
  fs.readdir('/home/myproxy/.pm2/logs', (err, files) => {
    if (err) res.end({ error: err })

    const re = new RegExp(`${fullDomain}-error-\\d.log`, 'g')

    const matches = files.filter(file => file.match(re))

    const file = matches.reduce((fin, el) => (fin < el ? el : fin), '')
    fs.createReadStream(`/home/myproxy/.pm2/logs/${file}`).pipe(res)
  })
})

export default logsRouter
