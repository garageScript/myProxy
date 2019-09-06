import express from 'express'
const adminRouter = express.Router()

adminRouter.use('/*', (req, res, next) => {
  if (!req.cookies.adminPass) return res.redirect('/login')
  next()
})

adminRouter.get('/', (req, res) => {
  res.render('admin/providers')
})

export { adminRouter }
