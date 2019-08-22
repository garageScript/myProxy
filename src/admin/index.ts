import express from 'express'
const adminRouter = express.Router()

adminRouter.use('/*', (req, res, next) =>  {
  if (!req.cookies.adminPass) return res.redirect('/login')
  next()
})

adminRouter.get('/serviceHostKeys', (req, res) => {
  res.render('admin')
})

export { adminRouter }
