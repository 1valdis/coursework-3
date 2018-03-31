const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)

module.exports = router
