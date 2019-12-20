import { hashPass } from '../helpers/crypto'
import { getTokenById } from '../lib/data'
let pass = ''

const isCorrectCredentials = (password: string, correct: string): boolean => {
  const adminPassword = hashPass(password)
  const userPassword = hashPass(correct)
  return userPassword === adminPassword
}

const isValidAccessToken = (token: string): boolean => !!getTokenById(token)

const setPass = (password: string): void => {
  pass = password
}

const setupAuth = (req, res, next): void => {
  const { adminPass } = req.cookies
  const { authorization = '' } = req.headers
  if (
    adminPass === hashPass(pass) ||
    isCorrectCredentials(authorization, pass)
  ) {
    req.user = { isAdmin: true, isUser: true }
    return next()
  }
  if (isValidAccessToken(authorization)) {
    {
      req.user = { isUser: true }
    }
    return next()
  }
  return next()
}

export { setupAuth, setPass, isCorrectCredentials }
