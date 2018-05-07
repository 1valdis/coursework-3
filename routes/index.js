const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)
router.get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
router.get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
router.get('/products/:id', catchAsyncErrors(storeController.getProductById))

router.get('/basket', catchAsyncErrors(storeController.getBasket))
router.post('/basket/add', catchAsyncErrors(storeController.addToBasket))
router.post('/basket/remove', catchAsyncErrors(storeController.removeFromBasket))

router.post('/order', catchAsyncErrors(storeController.createOrder))
// todo
router.get('orders', catchAsyncErrors(storeController.getOrders))
router.get('/order/:slug', catchAsyncErrors(storeController.getOrderById))

router.get('/warranty', storeController.getWarranty)
router.get('/delivery', storeController.getDelivery)
router.get('/about', storeController.getAbout)

module.exports = router
