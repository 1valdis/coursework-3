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
exports.getProductsByCategory = async (req, res) => {
  const [products, category] = await Promise.all([
    db.products.byCategory(req.params.id),
    db.categories.byId(req.params.id)
  ])
  res.render('products', {
    title: category.name,
    products,
    category
  })
}
exports.getProductById = async (req, res) => {
  const product = await db.products.byId(req.params.id)
  res.render('product', {
    title: product.name,
    product
  })
}

exports.getBasket = async (req, res) => {
  const [basket, sum] = await Promise.all([
    db.baskets.bySessionId(req.session.id),
    db.baskets.sumBySessionId(req.session.id)
  ])

  res.render('basket', {
    title: 'Корзина',
    basket,
    sum
  })
}

exports.addToBasket = async (req, res) => {
  req.session.basketExists = true

  if (!/^\d+$/.test(req.body.quantity)) {
    req.flash('danger', 'Указано неправильное количество')
    res.redirect('back')
    return
  }

  await db.baskets.addToBasket(
    req.session.id,
    req.body.product_id,
    req.body.quantity
  )

  req.flash('success', 'Успешно добавлен в <a href="/basket">корзину</a>!')
  res.redirect('back')
}

exports.removeFromBasket = async (req, res) => {
  if (!req.session || !req.session.basketExists) {
    req.flash('danger', 'Корзина пуста')
    res.redirect('back')
    return
  }

  await db.baskets.removeFromBasket(
    req.session.id,
    req.body.product_id,
    req.body.quantity
  )

  req.flash('success', 'Удалено')
  res.redirect('back')
}

exports.createOrder = async (req, res) => {
  const orderDetails = {
    sessionId: req.session.id,
    ...req.body
  }
  try {
    const slug = (await db.orders.makeOrder(orderDetails)).make_order
    req.flash('success', 'Заказ успешно создан!')
    res.redirect(`/orders/${slug}`)
  } catch (e) {
    req.flash('danger', 'Ошибка при создании заказа:<br>' + e.message)
    console.log(e)
    res.redirect('back')
  }
}

exports.getOrders = async (req, res) => {
  const orders = await db.orders.bySessionId(req.session.id)
  res.render('orders', {
    orders,
    title: 'Заказы'
  })
}

exports.getOrderBySlug = async (req, res) => {
  const [info, items] = await Promise.all([
    db.orders.bySlug(req.params.slug),
    db.orderItems.byOrderSlug(req.params.slug)
  ])
  res.render('order', {
    info,
    items,
    title: 'Заказ'
  })
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