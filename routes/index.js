const router = require('express').Router()

const storeController = require('../controllers/storeController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

router.get('/', storeController.getIndex)

router.get('/flash', function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('primary', 'Flash is back!')
  req.flash('warning', 'Oh shit!')
  res.redirect('/')
})

module.exports = router
