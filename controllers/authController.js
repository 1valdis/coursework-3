const db = require('../db')
const passport = require('passport')

exports.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      req.flash('danger', err.message)
      return res.redirect('back')
    }
    if (!user) {
      req.flash('danger', 'Нипутю!')
      return res.redirect('back')
    }
    req.flash('success', 'Вэлкам!')
    res.redirect('/admin')
  })(req, res, next)
}

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
