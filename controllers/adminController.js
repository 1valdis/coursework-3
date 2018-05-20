const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)

const db = require('../db')
const bcrypt = require('bcrypt')
const multer = require('multer')

const h = require('../helpers')

const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, next) {
    if (h.isImage(file.buffer)) {
      next(null, true)
    } else {
      next('Это не картинка', false)
    }
  },
  filename (req, file, next) {
    next(null, `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`)
  }
}

exports.upload = multer(multerOptions).single('pic')

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
  res.render('admin', {
    title: 'Админка'
  })
}

exports.adminPrivilege = privilege => {
  return function (req, res, next) {
    if (req.user && req.user[privilege]) {
      return next()
    }
    next(`У вас нет полномочий для этих действий.`)
  }
}

exports.editCategoryForm = async (req, res) => {
  const category = await db.categories.byId(req.params.id)
  res.render('editCategory', {
    title: `Редактирование ${category.name}`,
    category
  })
}
exports.createCategoryForm = (req, res) => {
  res.render('editCategory', {
    title: `Создание категории`
  })
}
exports.editCategory = async (req, res) => {
  console.log('TODO: UPDATE CATEGORY')
}
exports.createCategory = async (req, res) => {
  console.log('TODO: CREATE CATEGORY')
}
exports.deleteCategory = async (req, res) => {
  console.log('TODO: DELETE CATEGORY')
}

exports.editProductForm = async (req, res) => {
  const [product, categories] = await Promise.all([
    db.products.byId(req.params.id),
    db.categories.all()
  ])
  res.render('editProduct', {
    title: `Редактирование ${product.name}`,
    product,
    categories
  })
}
exports.createProductForm = (req, res) => {
  res.render('editProduct', {
    title: `Создание товара`
  })
}
exports.editProduct = async (req, res) => {
  console.log('TODO: UPDATE PRODUCT')
}
exports.createProduct = async (req, res) => {
  console.log('TODO: CREATE PRODUCT')
}
exports.deleteProduct = async (req, res) => {
  console.log('TODO: DELETE PRODUCT')
}
