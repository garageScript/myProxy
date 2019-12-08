import express from 'express'
import adminRouter from './admin'
import logsRouter from './logs'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import statusRouter from './serverStatus'
import { getAvailableDomains } from '../lib/data'

const apiRouter = express.Router()

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/logs', logsRouter)
apiRouter.use('/mappings', mappingRouter)
apiRouter.use('/sshKeys', sshKeyRouter)
apiRouter.use('/statuses', statusRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
