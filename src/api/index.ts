import express from 'express'
import adminRouter from './admin'
import mappingRouter from './mapping'

const apiRouter = express.Router()

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/mappings', mappingRouter)

export { apiRouter }
