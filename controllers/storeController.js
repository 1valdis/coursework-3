exports.getIndex = (req, res) => {
  res.render('index', { title: 'Главная' })
}
exports.getCatalogue = (req, res)=>{
  res.render('catalogue', { title: 'Каталог' })
}
exports.getRebates = (req, res)=>{
  res.render('rebates', { title: 'Акции' })
}
exports.getWarranty = (req, res)=>{
  res.render('warranty', { title: 'Гарантия' })
}
exports.getDelivery = (req, res) => {
  res.render('delivery', { title: 'Доставка' })
}
exports.getAbout = (req, res) => {
  res.render('about', { title: 'О нас' })
}