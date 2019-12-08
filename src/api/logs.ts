import express from 'express'
import environment from '../helpers/environment'
import fs from 'fs'
import { getMappingById } from '../lib/data'

// const { isProduction } = environment

const logsRouter = express.Router()

logsRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const { fullDomain } = getMappingById(id)

  res.setHeader('content-type', 'text')
  fs.createReadStream(`/home/myproxy/.pm2/logs/${fullDomain}-err.log`)
})

export default logsRouter
