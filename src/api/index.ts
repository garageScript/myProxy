import express from 'express'
import adminRouter from './admin'
import mappingRouter from './mapping'
import { getAvailableDomains } from './lib/data'
import { auth } from '../auth'

const apiRouter = express.Router()

apiRouter.use('/admin', auth, adminRouter.app)
apiRouter.use('/mappings', auth, mappingRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
