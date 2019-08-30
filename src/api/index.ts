import express from 'express'
import adminRouter from './admin'
import providers from './providers'

const apiRouter = express.Router()
apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/providers', providers)

export { apiRouter }
