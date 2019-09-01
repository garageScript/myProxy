import express from 'express'
import adminRouter from './admin'
import providers from './providers'
import mappingRouter from './mapping'

const apiRouter = express.Router()
apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/providers', providers)
apiRouter.use('/mappings', mappingRouter)

export { apiRouter }
