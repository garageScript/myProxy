import express from 'express'
const auth = express.Router()

auth.use('/*', (req, res, next) => {
  const { adminPass } = req.cookies
  if (!adminPass) return res.status(401).redirect('/login')
  next()
})

export { auth }
