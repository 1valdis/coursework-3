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
    sum: sum.sum
  })
  
}

exports.addToBasket = async (req, res) => {
  req.session.basketExists = true

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
  console.log(req.body)
  req.flash('success', 'Заказ успешно создан!')
  res.redirect('back')
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
