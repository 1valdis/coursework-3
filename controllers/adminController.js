const db = require('../db')
const bcrypt = require('bcrypt')

exports.loginForm = (req, res) => {
  if (req.user) {
    req.flash('Вы уже вошли')
    return res.redirect('/admin')
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
    return next('Имя пользователя не может быть длиннее 100 символов')
  }
  if (req.body.password.length > 72) {
    return next('Пароль не может быть длиннее 72 символов')
  }
  next()
}

exports.adminPage = (req, res) => {
  res.render('admin', {title: 'Админка'})
}

exports.adminPrivilege = (privilege) => {
  return function (req, res, next) {
    if (req.user && req.user[privilege]) {
      return next()
    }
    next(`У вас нет полномочий для этих действий.`)
  }
}

exports.editCategoryForm = async (req, res) => {
  const category = await db.categories.byId(req.params.id)
  res.render('editCategory', {title: `Редактирование ${category.name}`, category})
}

exports.createCategoryForm = (req, res) => {
  res.render('editCategory', {})
}

exports.updateCategory = async (req, res) => {
  console.log('TODO: UPDATE CATEGORY')
}

exports.createCategory = async (req, res) => {
  console.log('TODO: CREATE CATEGORY')
}
