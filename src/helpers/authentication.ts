const validUIAccess = (req, res, next): void => {
  if (!req.admin && !req.user) return res.redirect('/login')
  return next()
}

const validAdmin = (req, res, next): void => {
  if (!req.admin) return res.status(401).send('Unauthorized')
  return next()
}

const validUser = (req, res, next): void => {
  if (!req.admin && !req.user) return res.status(401).send('Unauthorized')
  return next()
}

export { validUIAccess, validAdmin, validUser }
