import express from 'express'
import { auth } from '../auth'

const adminRouter = express.Router()

adminRouter.use(auth)
adminRouter.get('/', (req, res) => {
  res.render('admin/providers')
})

export { adminRouter }
