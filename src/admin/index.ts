import express from 'express'

const adminRouter = express.Router()

adminRouter.get('/accessTokens', (req, res) => {
  res.render('admin/accessTokens')
})
adminRouter.get('/', (req, res) => {
  res.render('admin/providers')
})

export { adminRouter }
