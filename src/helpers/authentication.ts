const validUIAccess = (req, res, next): void => {
  if (!req.user) {
    return res.redirect('/login')
  }
  return next()
}

export { validUIAccess }
