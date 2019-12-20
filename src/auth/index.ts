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

// Express middleware functions returns void
const setupAuth = password => {
  return (req, res, next): void => {
    const { adminPass } = req.cookies
    const { authorization = '' } = req.headers

    if (authorization) {
      const isCorrect = isCorrectCredentials(authorization as string, password)
      if (!adminPass && !isCorrect) res.status(401).send('Unauthorized')
      return next()
    }
    if (!adminPass) return res.render('login', { error: '' })
    return next()
  }
}

// This will be changed into setupAuth at a PR later
const setupAccessToken = (req, res, next): void => {
  const { adminPass } = req.cookies
  const { access = '', authorization = '' } = req.headers
  req.user = {
    isAdmin: false,
    isUser: false
  }
  if (adminPass === hashPass(pass)) {
    req.user.isAdmin = true
    req.user.isUser = true
    return next()
  }
  if (authorization || access) {
    const correctPw = isCorrectCredentials(authorization, pass)
    const correctToken = isValidAccessToken(access)
    if (!correctPw && !correctToken) return res.status(401).send('Unauthorized')
    if (correctPw) {
      req.user.isAdmin = true
    }
    if (correctToken) {
      req.user.isUser = true
    }
    return next()
  }
  return next()
}

export { setupAuth, setPass, setupAccessToken, isCorrectCredentials }
