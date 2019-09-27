import express from 'express'
import { hashPass } from '../helpers/crypto'
const auth = express.Router()

const isCorrectCredentials = (password: string, correct: string): boolean => {
  const adminPassword = hashPass(password)
  const userPassword = hashPass(correct)
  return userPassword === adminPassword
}

const setupAuth = password => {
  return (req, res, next) => {
    const { adminPass } = req.cookies
    if (
      !adminPass &&
      !isCorrectCredentials(
        (req.headers.authorization as string) || '',
        password
      )
    ) {
      return res.status(401).send('Unauthorized')
    }
    next()
  }
}

export { setupAuth, isCorrectCredentials }
