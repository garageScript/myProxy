import { hashPass } from '../helpers/crypto'

const isCorrectCredentials = (password: string, correct: string): boolean => {
  const adminPassword = hashPass(password)
  const userPassword = hashPass(correct)
  return userPassword === adminPassword
}

const setupAuth = password => {
  return (req, res, next): undefined => {
    const { adminPass } = req.cookies
    if(!adminPass) return res.render('login', { error: '' })
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
