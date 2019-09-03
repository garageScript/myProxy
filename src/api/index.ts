import express from 'express'
import adminRouter from './admin'
import providers from './providers'
import mappingRouter from './mapping'

const apiRouter = express.Router()

apiRouter.use('/*', (req, res, next) => {
  if (!req.cookies.adminPass) return res.status(401)
  next()
})

apiRouter.use('/admin', adminRouter.app)
apiRouter.use('/providers', providers)
apiRouter.use('/mappings', mappingRouter)

export { apiRouter }
