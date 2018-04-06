const db = require('../db')

exports.getIndex = (req, res) => {
  res.render('index', { title: 'Главная' })
}
exports.getCatalogue = async (req, res) => {
  const categories = await db.categories.all()
  res.render('catalogue', { title: 'Каталог', categories })
}
exports.getProductsByCategory = async (req, res)=>{
  const [products, category] = await Promise.all([
    db.products.byCategory(req.params.id),
    db.categories.byId(req.params.id)
  ])
  res.render('products', {title: category.name, products})
}
exports.getDiscounts = (req, res) => {
  res.render('rebates', { title: 'Акции' })
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
