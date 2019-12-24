import express, { Response, NextFunction } from 'express'
import adminRouter from './admin'
import logsRouter from './logs'
import mappingRouter from './mapping'
import sshKeyRouter from './sshKeys'
import accessTokensRouter from './accessToken'
import { getAvailableDomains } from '../lib/data'
import { AuthenticatedRequest } from '../types/general'

const apiRouter = express.Router()

apiRouter.use(
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || (!req.user.isPseudoAdmin && !req.user.isAdmin)) {
      res.status(401).send('Unauthorized')
      return
    }
    return next()
  }
)

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/logs', logsRouter)
apiRouter.use('/mappings', mappingRouter)
apiRouter.use('/sshKeys', sshKeyRouter)
apiRouter.use('/accessTokens', accessTokensRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
