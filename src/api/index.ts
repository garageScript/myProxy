import express from 'express'
import adminRouter from './admin'
import mappingRouter from './mapping'
import { getAvailableDomains } from '../lib/data'

const apiRouter = express.Router()

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/mappings', mappingRouter)

apiRouter.get('/availableDomains', (req, res) => {
  const domains = getAvailableDomains()
  res.json(domains)
})

export { apiRouter }
