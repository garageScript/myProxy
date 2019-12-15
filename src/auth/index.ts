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
  const { authorization = '' } = req.headers

  if (authorization) {
    const isCorrect = isCorrectCredentials(authorization as string, pass)
    if (!adminPass && !isCorrect) return res.status(401).send('Unauthorized')
    return next()
  }
  if (!adminPass) return res.render('login', { error: '' })
  return next()
}

const setupTokenAuth = (req, res, next): void => {
  const { adminPass } = req.cookies
  const { access, authorization = '' } = req.headers

  if (access || authorization) {
    const isCorrect =
      isValidToken(access) ||
      isCorrectCredentials(authorization as string, pass)
    if (!adminPass && !isCorrect) return res.status(401).send('Unauthorized')
    return next()
  }
  if (!adminPass) return res.render('login', { error: '' })
  return next()
}

export { setupAuth, isCorrectCredentials, setPass, setupTokenAuth }
