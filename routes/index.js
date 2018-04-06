const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)
router.get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
router.get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
router.get('/discounts', storeController.getDiscounts)
router.get('/warranty', storeController.getWarranty)
router.get('/delivery', storeController.getDelivery)
router.get('/about', storeController.getAbout)

module.exports = router
