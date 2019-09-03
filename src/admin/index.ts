import express from 'express'
const adminRouter = express.Router()

adminRouter.use('/*', (req, res, next) => {
  if (!req.cookies.adminPass) return res.redirect('/login')
  next()
})

adminRouter.get('/providers', (req, res) => {
  res.render('admin/providers')
})

export { adminRouter }
