const db = require('../db')

exports.getIndex = (req, res) => {
  res.render('index', { title: 'Главная' })
}
exports.getCatalogue = async (req, res) => {
  const categories = await db.categories.all()
  res.render('catalogue', { title: 'Каталог', categories })
}
exports.getProductsByCategory = async (req, res) => {
  const [products, category] = await Promise.all([
    db.products.byCategory(req.params.id),
    db.categories.byId(req.params.id)
  ])
  res.render('products', { title: category.name, products })
}
exports.getProductById = async (req, res) => {
  const product = await db.products.byId(req.params.id)
  res.render('product', { title: product.name, product })
}
exports.getDiscounts = (req, res) => {
  res.render('discounts', { title: 'Акции' })
}

exports.addToBasket = async (req, res) => {
  if (!req.session.basket) {
    req.session.basket = []
  }

  const existing = req.session.basket.find(p => p.product_id === req.body.product_id)
  if (existing === undefined) {
    req.session.basket.push({
      product_id: req.body.product_id,
      quantity: +req.body.quantity
    })
  } else {
    existing.quantity += +req.body.quantity
  }

  req.flash('success', 'Успешно добавлен в <a href="/basket">корзину</a>!')
  res.redirect('back')
}

exports.getWarranty = (req, res) => {
  res.render('warranty', { title: 'Гарантия' })
}
exports.getDelivery = (req, res) => {
  res.render('delivery', { title: 'Доставка' })
}
exports.getAbout = (req, res) => {
  res.render('about', { title: 'О нас' })
}
