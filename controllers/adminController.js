const fs = require('fs')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)

const db = require('../db')
const bcrypt = require('bcrypt')
const multer = require('multer')

const h = require('../helpers')

const multerOptions = {
  storage: multer.memoryStorage()
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

exports.validateCategoryForm = (req, res, next) => {
  let errMessages = ''
  if (!/^.{1,50}$/.test(req.body.name)) {
    errMessages += 'Имя не может быть длиннее 50 символов. '
  }
  if (req.body.description && req.body.description.length > 50000) {
    errMessages += 'Описание не может быть длиннее 50 000 символов. '
  }

  if (req.file) {
    if (req.file.size > 10000000) {
      errMessages += 'Картинка не может превышать размером 10 Мб. '
    }
    if (!h.isImage(req.file.buffer)) {
      errMessages += 'Выберите более распространённый формат для картинки.'
    }
  }

  if (errMessages !== '') {
    next(errMessages)
  } else {
    next()
  }
}
exports.createCategoryForm = (req, res) => {
  res.render('editCategory', {
    title: `Создание категории`
  })
}
exports.createCategory = async (req, res, next) => {
  let extension, filename
  if (req.file) {
    extension = req.file.mimetype.split('/')[1]
    filename = `${req.file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}${extension ? '.' + extension : ''}`
  }

  let categoryId

  try {
    categoryId = await db.categories.create(req.body.name, req.body.description, filename)
  } catch (e) {
    if (e.code === '23505') {
      next('Категория с таким названием уже существует')
    }
    return next(e)
  }

  if (req.file) {
    try {
      await writeFile(path.join(__dirname, '../', 'public/storepictures/', filename), req.file.buffer)
      // in ideal world this not gonna happen but who knows
    } catch (e) {
      await db.categories.deleteById(categoryId)
      return next('Проблема с загрузкой файла...')
    }
  }

  req.flash('success', 'Категория создана.')
  res.redirect('/catalogue')
}
exports.editCategoryForm = async (req, res) => {
  const category = await db.categories.byId(req.params.id)
  res.render('editCategory', {
    title: `Редактирование ${category.name}`,
    category
  })
}
exports.editCategory = async (req, res) => {

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
