const router = require('express').Router()

const storeController = require('../controllers/storeController')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

// store

router.get('/', storeController.getIndex)
router.get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
router.get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
router.get('/products/:id', catchAsyncErrors(storeController.getProductById))

router.get('/cart', catchAsyncErrors(storeController.getCart))
router.post('/cart/add', catchAsyncErrors(storeController.addToCart))
router.post('/cart/remove', catchAsyncErrors(storeController.removeFromCart))

router.post('/order', catchAsyncErrors(storeController.createOrder))
router.get('/orders', catchAsyncErrors(storeController.getOrders))
router.get('/orders/:slug', catchAsyncErrors(storeController.getOrderBySlug))

router.get('/warranty', storeController.getWarranty)
router.get('/delivery', storeController.getDelivery)
router.get('/about', storeController.getAbout)

// admin panel

router.get('/login', adminController.loginForm)
router.post('/login', adminController.validateLoginForm, authController.login)
router.post('/request', adminController.validateLoginForm, adminController.accessRequest)

router.get('/admin', authController.isLoggedIn, adminController.adminPage)

module.exports = router
