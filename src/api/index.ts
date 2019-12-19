import express from 'express'
import adminRouter from './admin'
import logsRouter from './logs'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import accessTokensRouter from './accessToken'
import { getAvailableDomains } from '../lib/data'
import { validUser, validAdmin } from '../helpers/authentication'

const apiRouter = express.Router()

apiRouter.use('/admin', validAdmin, adminRouter.app)
apiRouter.use('/logs', validUser, logsRouter)
apiRouter.use('/mappings', validUser, mappingRouter)
apiRouter.use('/sshKeys', validUser, sshKeyRouter)
apiRouter.use('/accessTokens', validUser, accessTokensRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
