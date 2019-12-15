import express from 'express'
import adminRouter from './admin'
import logsRouter from './logs'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import accessTokensRouter from './accessToken'
import { getAvailableDomains } from '../lib/data'
import { setupAuth, setupTokenAuth } from '../auth'

const apiRouter = express.Router()

apiRouter.use('/admin', setupAuth, adminRouter.app)
apiRouter.use('/logs', setupTokenAuth, logsRouter)
apiRouter.use('/mappings', setupTokenAuth, mappingRouter)
apiRouter.use('/sshKeys', setupTokenAuth, sshKeyRouter)
apiRouter.use('/accessTokens', setupTokenAuth, accessTokensRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
