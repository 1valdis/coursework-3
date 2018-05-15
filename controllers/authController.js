const passport = require('passport')

exports.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err.message)
    }
    if (!user) {
      return next('Нипутю!')
    }
    req.login(user, err => {
      if (err) {
        console.log('something is wrong: ', err)
        return next('Что-то сломалось..')
      }
      req.flash('success', 'Вэлкам!')
      res.redirect('/admin')
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  if (req.user) {
    req.logout()
    req.flash('success', 'Увидимся ;)')
  }
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
