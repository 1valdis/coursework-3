const db = require('../db')
const bcrypt = require('bcrypt')

exports.loginForm = (req, res) => {
  if (req.user) {
    //...
    return res.redirect('/')
  }
  res.render('login', {
    title: 'Вход'
  })
}

exports.accessRequest = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 12)
  db.admins.createAdminRequest(req.body.username, hash)
  req.flash('success', 'Ожидайте.')
  res.redirect('back')
}

exports.validateLoginForm = (req, res, next) => {
  if (req.body.username.length > 100) {
    req.flash('danger', 'Имя пользователя не может быть длиннее 100 символов')
    return res.redirect('back')
  }
  if (req.body.password.length > 72) {
    req.flash('danger', 'Пароль не может быть длиннее 72 символов')
    return res.redirect('back')
  }
  next()
}

exports.adminPage = (req, res)=>{
  res.render('admin')
}