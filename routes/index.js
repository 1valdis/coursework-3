const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)
router.get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
router.get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
router.get('/products/:id', catchAsyncErrors(storeController.getProductById))

router.get('/cart', catchAsyncErrors(storeController.getCart))
router.post('/cart/add', catchAsyncErrors(storeController.addToCart))
router.post('/cart/remove', catchAsyncErrors(storeController.removeFromCart))

router.post('/order', catchAsyncErrors(storeController.createOrder))
// todo
router.get('/orders', catchAsyncErrors(storeController.getOrders))
router.get('/orders/:slug', catchAsyncErrors(storeController.getOrderBySlug))

router.get('/warranty', storeController.getWarranty)
router.get('/delivery', storeController.getDelivery)
router.get('/about', storeController.getAbout)

module.exports = router
