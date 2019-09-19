import express from 'express'
import { hashPass } from '../helpers/crypto'
const auth = express.Router()

const isCorrectCredentials = (password: string): boolean => {
  const adminPassword = hashPass(process.env.ADMIN as string)
  const userPassword = hashPass(password)
  return userPassword === adminPassword
}

auth.use('/*', (req, res, next) => {
  const { adminPass } = req.cookies
  if (
    !adminPass &&
    !isCorrectCredentials((req.headers.Authorization as string) || '')
  )
    return res.status(401).redirect('/login')
  next()
})

export { auth, isCorrectCredentials }
