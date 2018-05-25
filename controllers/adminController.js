const fs = require('fs')
const path = require('path')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

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

exports.adminPage = async (req, res) => {
  const stats = await db.siteVisits.stats()
  res.render('admin', {
    title: 'Админка',
    stats
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
  res.redirect(`/categories/${categoryId}`)
}
exports.editCategoryForm = async (req, res) => {
  const category = await db.categories.byId(req.params.id)
  res.render('editCategory', {
    title: `Редактирование ${category.name}`,
    category
  })
}
exports.editCategory = async (req, res, next) => {
  const categoryEdited = await db.categories.byId(req.params.id)

  if (!req.file && req.body.preserveimage) {
    try {
      await db.categories.updateById(req.params.id, req.body.name, req.body.description)
    } catch (e) {
      if (e.code === '23505') {
        req.flash('danger', 'Категория с таким названием уже существует.')
        return res.redirect('back')
      }
    }
  } else {
    const extension = req.file ? req.file.mimetype.split('/')[1] : null
    const filename = req.file ? `${req.file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}${extension ? '.' + extension : ''}` : null

    try {
      await db.categories.updateById(req.params.id, req.body.name, req.body.description, filename)
    } catch (e) {
      if (e.code === '23505') {
        req.flash('danger', 'Категория с таким названием уже существует.')
        return res.redirect('back')
      }
    }

    if (categoryEdited.image) {
      try {
        await unlink(path.join(__dirname, '../', 'public/storepictures/', categoryEdited.image))
      } catch (e) {
        if (e.code !== 'ENOENT') {
          return next(e)
        } else {
          req.flash('warning', 'Файла прошлой картинки не существовало... Странно.')
        }
      }
    }
    if (req.file) {
      try {
        await writeFile(path.join(__dirname, '../', 'public/storepictures/', filename), req.file.buffer)
      } catch (e) {
        return next(e)
      }
    }
  }

  req.flash('success', 'Категория обновлена.')
  res.redirect(`/categories/${req.params.id}`)
}
exports.deleteCategory = async (req, res, next) => {
  const categoryDeleted = await db.categories.byId(req.params.id)

  try {
    await db.categories.deleteById(req.params.id)
  } catch (e) {
    req.flash('danger', 'Не получилось удалить категорию из бд...')
    return res.redirect('back')
  }

  if (categoryDeleted.image) {
    try {
      await unlink(path.join(__dirname, '../', 'public/storepictures/', categoryDeleted.image))
    } catch (e) {
      if (e.code !== 'ENOENT') {
        return next(e)
      } else {
        req.flash('warning', 'Файла прошлой картинки не существовало... Странно.')
      }
    }
  }

  req.flash('success', 'Удалено')
  res.redirect('/catalogue')
}

exports.validateProductFrom = async (req, res, next) => {
  let errMessages = ''
  if (!/^.{1,50}$/.test(req.body.name)) {
    errMessages += 'Название товара должно быть указано и не должно быть длиннее 50 символов. '
  }
  if (!/^.{1,50}$/.test(req.body.category_name)) {
    errMessages += 'Категория должна быть указана и не должна быть длиннее 50 символов. '
  }
  if (req.body.description && req.body.description.length > 50000) {
    errMessages += 'Описание не может быть больше 50 000 символов '
  }
  if (req.file) {
    if (req.file.size > 10000000) {
      errMessages += 'Картинка не может превышать размером 10 Мб. '
    }
    if (!h.isImage(req.file.buffer)) {
      errMessages += 'Выберите более распространённый формат для картинки. '
    }
  }
  if (!/^\d{1,100}[.,]\d{2}$/.test(req.body.cost)) {
    errMessages += 'Цена имеет неправильный формат. '
  } else {
    req.body.cost = req.body.cost.replace(',', '.')
  }
  // if editing
  if (req.params.id && !/^-?\d{1,100}$/.test(req.body.count_available_change)) {
    errMessages += 'Изменение доступного количества выглядит неправильно. '
    // if creating
  } else if (!req.params.id && !/^\d{1,100}$/.test(req.body.count_available)) {
    errMessages += 'Начальное доступное количество выглядит неправильно.'
  }

  if (errMessages !== '') {
    return next(errMessages)
  }
  next()
}
exports.createProductForm = async (req, res) => {
  const product = {}
  if (req.get('Referrer') && req.get('Referrer').match(/\/categories\/(\d+)$/)) {
    product.category_id = +req.get('Referrer').match(/\/categories\/(\d+)$/)[1]
  }
  res.render('editProduct', {
    title: `Создание товара`,
    categories: await db.categories.all(),
    product
  })
}
exports.createProduct = async (req, res, next) => {
  let extension, filename
  if (req.file) {
    extension = req.file.mimetype.split('/')[1]
    filename = `${req.file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}${extension ? '.' + extension : ''}`
  }

  let productId

  try {
    productId = await db.products.create({
      ...req.body,
      image: filename || null
    })
  } catch (e) {
    if (e.code === '23505') {
      next('Товар с таким названием уже существует')
    }
    return next(e)
  }

  if (req.file) {
    try {
      await writeFile(path.join(__dirname, '../', 'public/storepictures/', filename), req.file.buffer)
      // in ideal world this not gonna happen but who knows
    } catch (e) {
      await db.products.deleteById(productId)
      return next('Проблема с загрузкой файла...')
    }
  }

  req.flash('success', 'Товар создан.')
  res.redirect(`/products/${productId}`)
}
exports.editProductForm = async (req, res, next) => {
  try {
    const [product, categories] = await Promise.all([
      db.products.byId(req.params.id),
      db.categories.all()
    ])
    res.render('editProduct', {
      title: `Редактирование ${product.name}`,
      product,
      categories
    })
  } catch (e) {
    if (e.code === 0) next()
  }
}
exports.editProduct = async (req, res, next) => {
  const productEdited = await db.products.byId(req.params.id)

  if (!req.file && req.body.preserveimage) {
    try {
      await db.products.updateById(req.params.id, {
        ...req.body
      })
    } catch (e) {
      if (e.code === '23505') {
        req.flash('danger', 'Товар с таким названием уже существует.')
      } else if (e.code === '23502' && e.column === 'category_id') {
        req.flash('danger', 'Такой категории не существует, пожалуйста, укажите существующую.')
      }
      return res.redirect('back')
    }
  } else {
    const extension = req.file ? req.file.mimetype.split('/')[1] : null
    const filename = req.file ? `${req.file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}${extension ? '.' + extension : ''}` : null

    try {
      await db.products.updateById(req.params.id, {
        ...req.body,
        image: filename
      })
    } catch (e) {
      if (e.code === '23505') {
        req.flash('danger', 'Товар с таким названием уже существует.')
        return res.redirect('back')
      }
      return next(e)
    }

    if (productEdited.image) {
      try {
        await unlink(path.join(__dirname, '../', 'public/storepictures/', productEdited.image))
      } catch (e) {
        if (e.code !== 'ENOENT') {
          return next(e)
        } else {
          req.flash('warning', 'Файла прошлой картинки не существовало... Странно.')
        }
      }
    }
    if (req.file) {
      try {
        await writeFile(path.join(__dirname, '../', 'public/storepictures/', filename), req.file.buffer)
      } catch (e) {
        return next(e)
      }
    }
  }

  req.flash('success', 'Товар обновлен.')
  res.redirect(`/products/${req.params.id}`)
}
exports.deleteProduct = async (req, res, next) => {
  const productDeleted = await db.products.byId(req.params.id)

  try {
    await db.products.deleteById(req.params.id)
  } catch (e) {
    req.flash('danger', 'Не получилось удалить товар из бд...')
    return res.redirect('back')
  }

  if (productDeleted.image) {
    try {
      await unlink(path.join(__dirname, '../', 'public/storepictures/', productDeleted.image))
    } catch (e) {
      if (e.code !== 'ENOENT') {
        return next(e)
      } else {
        req.flash('warning', 'Файла прошлой картинки не существовало... Странно.')
      }
    }
  }

  req.flash('success', 'Удалено')
  res.redirect('/catalogue')
}

// admins & admin requests

exports.getAdmins = async (req, res) => {
  const [admins, adminRequests] = await Promise.all([
    db.admins.allAdmins(),
    db.admins.allRequests()
  ])
  res.render('admins', {title: 'Админы', admins, adminRequests})
}
exports.approveRequest = async (req, res) => {
  const requestData = {
    id: req.body.id,
    can_edit_store: !!req.body.can_edit_store,
    can_edit_admins: !!req.body.can_edit_admins,
    can_manage_orders: !!req.body.can_manage_orders
  }
  await db.admins.approveRequest(requestData)
  req.flash('success', 'Успешно')
  res.redirect('back')
}
exports.deleteRequest = async (req, res) => {
  await db.admins.deleteRequest(req.body.id)
  req.flash('success', 'Удалено')
  res.redirect('back')
}
exports.restrictAdmin = async (req, res) => {
  const requestData = {
    id: req.body.id,
    can_edit_store: !!req.body.can_edit_store,
    can_edit_admins: !!req.body.can_edit_admins,
    can_manage_orders: !!req.body.can_manage_orders
  }
  await db.admins.editAdmin(requestData)
  req.flash('success', 'Успешно')
  res.redirect('back')
}
exports.deleteAdmin = async (req, res) => {
  await db.admins.deleteAdmin(req.body.id)
  req.flash('success', 'Удалено')
  res.redirect('back')
}

// orders

exports.getOrders = async (req, res) => {
  const [orders, order_statuses] = await Promise.all([
    db.orders.all(),
    db.orderStatuses.all()
  ])
  res.render('adminOrders', {title: 'Заказы', orders, order_statuses})
}
exports.validateEditOrder = (req, res, next) => {
  let errMessages = ''
  if (!/^\d{1,100}$/.test(req.params.id)) {
    errMessages += 'Айди заказа выглядит неправильно. '
  }
  if (!/^\d{1,100}/.test(req.body.order_status)) {
    errMessages += 'Айди статуса заказа выглядит неправильно.'
  }

  if (errMessages !== '') {
    next(errMessages)
  } else {
    next()
  }
}
exports.editOrder = async (req, res) => {
  await db.orders.updateById(req.params.id, req.body.order_status)
  req.flash('success', 'Обновлено')
  res.redirect('back')
}
