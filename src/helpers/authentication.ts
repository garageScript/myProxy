const validUIAccess = (req, res, next): void => {
  if (!req.user) res.redirect('/login')
  return next()
}

export { validUIAccess }
