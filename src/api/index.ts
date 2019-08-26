import express from 'express'
import adminRouter from './admin'
import { services } from '../services'

const apiRouter = express.Router()
apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/services', services)

export { apiRouter }
