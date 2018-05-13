const passport = require('passport')

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'Welcome'
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'Увидимся ;)')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
    return
  }
  req.flash('danger', 'Вы должны войти в админку, чтобы это сделать')
  res.redirect('/login')
}
