import { hashPass } from '../helpers/crypto'

const isCorrectCredentials = (password: string, correct: string): boolean => {
  const adminPassword = hashPass(password)
  const userPassword = hashPass(correct)
  return userPassword === adminPassword
}

const setupAuth = password => {
  return (req, res, next): undefined => {
    const { adminPass } = req.cookies
    const { authorization = '' } = req.headers

    if (authorization) {
      const isAdmin = !isCorrectCredentials(authorization as string, password)
      if (!adminPass && isAdmin) res.status(401).send('Unauthorized')
      next()
    }
    if (!adminPass) return res.render('login', { error: '' })
    next()
  }
}

export { setupAuth, isCorrectCredentials }
