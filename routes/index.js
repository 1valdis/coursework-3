const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)
router.get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
router.get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
router.get('/products/:id', catchAsyncErrors(storeController.getProductById))
router.get('/discounts', storeController.getDiscounts)

router.post('/basket', catchAsyncErrors(storeController.addToBasket))

router.get('/warranty', storeController.getWarranty)
router.get('/delivery', storeController.getDelivery)
router.get('/about', storeController.getAbout)

module.exports = router
