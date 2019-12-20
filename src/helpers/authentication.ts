const validUIAccess = (req, res, next): void => {
  if (!req.user.isAdmin && !req.user.isUser) return res.redirect('/login')
  return next()
}

export { validUIAccess }
