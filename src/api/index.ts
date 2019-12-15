import express from 'express'
import adminRouter from './admin'
import logsRouter from './logs'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import accessTokensRouter from './accessToken'
import { getAvailableDomains } from '../lib/data'
import { setupPwAuth, setupPwTokenAuth } from '../auth'

const apiRouter = express.Router()

apiRouter.use('/admin', setupPwAuth, adminRouter.app)
apiRouter.use('/logs', setupPwTokenAuth, logsRouter)
apiRouter.use('/mappings', setupPwTokenAuth, mappingRouter)
apiRouter.use('/sshKeys', setupPwTokenAuth, sshKeyRouter)
apiRouter.use('/accessTokens', setupPwTokenAuth, accessTokensRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
