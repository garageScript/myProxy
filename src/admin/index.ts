import express from 'express'
import { validUIAccess } from '../helpers/authentication'

const adminRouter = express.Router()

adminRouter.use(validUIAccess)
adminRouter.get('/', (req, res) => {
  res.render('admin/providers')
})
adminRouter.get('/accessTokens', (req, res) => {
  res.render('admin/accessTokens')
})

export { adminRouter }
