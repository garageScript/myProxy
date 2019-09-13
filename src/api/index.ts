import express from 'express'
import adminRouter from './admin'
import mappingRouter from './mapping'
import { auth } from '../auth'

const apiRouter = express.Router()

apiRouter.use('/admin', auth, adminRouter.app)
apiRouter.use('/mappings', auth, mappingRouter)

export { apiRouter }
