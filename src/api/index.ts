import express from 'express'
import adminRouter from './admin'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import statusRouter from './serversStatus'
import { getAvailableDomains } from '../lib/data'

const apiRouter = express.Router()

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/mappings', mappingRouter)
apiRouter.use('/sshKeys', sshKeyRouter)
apiRouter.use('/statuses', statusRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
