import { hashPass } from '../helpers/crypto'
import { getTokenById } from '../lib/data'

let pass: string

const setPass = (password: string): void => {
  pass = password
}

const isCorrectCredentials = (password: string, correct: string): boolean => {
  const adminPassword = hashPass(password)
  const userPassword = hashPass(correct)
  return userPassword === adminPassword
}

const isValidToken = (token: string): boolean => {
  if (getTokenById(token)) return true
  return false
}

// From Express, middleware functions return void
const setupAuth = (req, res, next): void => {
  const { adminPass } = req.cookies
  const { access, authorization = '' } = req.headers

  if (authorization || access) {
    if (authorization) {
      const isCorrect = isCorrectCredentials(authorization as string, pass)
      if (isCorrect) req.admin = true
    }
    if (access) {
      const isCorrect = isValidToken(access)
      if (isCorrect) req.user = true
    }
    return next()
  }

  if (!adminPass) return res.render('login', { error: '' })
  return next()
}

export { isCorrectCredentials, setPass, setupAuth }
