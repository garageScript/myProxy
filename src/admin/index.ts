import express from 'express'
import { validUIAccess } from '../helpers/authentication'

const adminRouter = express.Router()

adminRouter.get('/', validUIAccess, (req, res) => {
  res.render('admin/providers')
})

export { adminRouter }
