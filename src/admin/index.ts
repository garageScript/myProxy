import express from 'express'
import provider from './providers'

const adminRouter = express.Router()

adminRouter.use('/*', (req, res, next) => {
  if (!req.cookies.adminPass) return res.redirect('/login')
  next()
})

adminRouter.use('/providers', provider)

export { adminRouter }
