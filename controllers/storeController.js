const db = require('../db')

exports.getIndex = (req, res) => {
  res.render('index', {
    title: 'Главная'
  })
}
exports.getCatalogue = async (req, res) => {
  const categories = await db.categories.all()
  res.render('catalogue', {
    title: 'Каталог',
    categories
  })
}
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const [products, category] = await db.task(t => {
      return t.batch([
          t.products.byCategory(req.params.id),
          t.categories.byId(req.params.id)        
      ]);
    ])
    res.render('products', {
      title: category.name,
      products,
      category
    })
  } catch (e) {
    if (e.code === 0) next()
  }
}
exports.getProductById = async (req, res, next) => {
  try {
    const product = await db.products.byId(req.params.id)
    res.render('product', {
      title: product.name,
      product
    })
  } catch (e) {
    if (e.code === 0) next()
  }
}

exports.getCart = async (req, res) => {
  const [cart, sum] = await Promise.all([
    db.carts.bySessionId(req.session.id),
    db.carts.sumBySessionId(req.session.id)
  ])

  res.render('cart', {
    title: 'Корзина',
    cart,
    sum
  })
}

exports.addToCart = async (req, res, next) => {
  req.session.cartExists = true

  if (!/^\d+$/.test(req.body.quantity) || +req.body.quantity < 1) {
    return next('Указано неправильное количество')
  }

  try {
    await db.carts.addToCart(
      req.session.id,
      req.body.product_id,
      req.body.quantity
    )
  } catch (e) {
    return next('Ошибка: ' + e.message)
  }

  req.flash('success', 'Успешно добавлен в <a href="/cart">корзину</a>!')
  res.redirect('back')
}

exports.removeFromCart = async (req, res, next) => {
  if (!req.session || !req.session.cartExists) {
    return next('Корзина пуста')
  }

  await db.carts.removeFromCart(
    req.session.id,
    req.body.product_id,
    req.body.quantity
  )

  req.flash('success', 'Удалено')
  res.redirect('back')
}

exports.createOrder = async (req, res, next) => {
  let errMessages = ''

  req.body.firstname = req.body.firstname.trim()
  if (!/^[a-zA-Zа-яА-ЯёЁ]{1,50}$/.test(req.body.firstname)) {
    errMessages += 'Имя выглядит неправильно.'
  }
  req.body.lastname = req.body.lastname.trim()
  if (!/^[a-zA-Zа-яА-ЯёЁ]{1,50}-?[a-zA-Zа-яА-ЯёЁ]{0,50}$/.test(req.body.lastname)) {
    errMessages += ' Фамилия выглядит неправильно.'
  }
  req.body.patronymic = req.body.patronymic.trim()
  if (!/^[a-zA-Zа-яА-ЯёЁ]{1,50}$/.test(req.body.patronymic)) {
    errMessages += ' Отчество выглядит неправильно.'
  }
  if (!/^[+]?[\d]{5,15}$/.test(req.body.phone)) {
    errMessages += ' Номер телефона выглядит неправильно.'
  }
  if (!req.body.address || req.body.address.length > 200 || req.body.address.length < 20) {
    errMessages += ' Адрес выглядит неправильно.'
  }
  if (req.body.details && req.body.details.length > 500) {
    errMessages += ' Комментарии к заказу не должны превышать 500 символов.'
  }

  if (errMessages !== '') {
    return next(errMessages)
  }

  const orderDetails = {
    sessionId: req.session.id,
    ...req.body
  }
  try {
    const slug = (await db.orders.makeOrder(orderDetails)).make_order
    req.flash('success', 'Заказ успешно создан!')
    res.redirect(`/orders/${slug}`)
  } catch (e) {
    return next('Ошибка при создании заказа:<br>' + e.message)
  }
}

exports.getOrders = async (req, res) => {
  const orders = await db.orders.bySessionId(req.session.id)
  res.render('orders', {
    orders,
    title: 'Заказы'
  })
}

exports.getOrderBySlug = async (req, res, next) => {
  try {
    const [info, items] = await Promise.all([
      db.orders.bySlug(req.params.slug),
      db.orderItems.byOrderSlug(req.params.slug)
    ])
    res.render('order', {
      info,
      items,
      title: 'Заказ'
    })
  } catch (e) {
    if (e.code === 0) next()
  }
}

exports.getWarranty = (req, res) => {
  res.render('warranty', {
    title: 'Гарантия'
  })
}
exports.getDelivery = (req, res) => {
  res.render('delivery', {
    title: 'Доставка'
  })
}
exports.getAbout = (req, res) => {
  res.render('about', {
    title: 'О нас'
  })
}

exports.statsCollection = (req, res, next) => {
  if (!req.originalUrl.startsWith('/storepictures') && !req.originalUrl.startsWith('/admin') && !req.originalUrl.startsWith('/login') && !req.originalUrl.startsWith('/logout') && !req.originalUrl.startsWith('/request')) {
    let modifiedUrl = req.originalUrl

    if (req.originalUrl.startsWith('/orders')) {
      modifiedUrl = '/orders/*'
    } else if (req.originalUrl.startsWith('/products')) {
      modifiedUrl = '/products/*'
    } else if (req.originalUrl.startsWith('/categories')) {
      modifiedUrl = '/categories/*'
    } else if (req.originalUrl.startsWith('/cart')) {
      modifiedUrl = '/cart/*'
    }

    db.stats.addSiteVisit(modifiedUrl)
  }
  
  if (req.originalUrl.startsWith('/products/')) {
    db.stats.addProductVisit(req.originalUrl.split('/')[2])
  }
  next()
}
