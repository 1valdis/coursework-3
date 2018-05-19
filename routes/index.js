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
router.post('/request', adminController.validateLoginForm, catchAsyncErrors(adminController.accessRequest))
router.get('/logout', authController.logout)

router.get('/admin', authController.isLoggedIn, adminController.adminPage)
// let's go head-on right now and then will make a bit DRYer after it all wraps up
router.get('/admin/categories/create',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  adminController.createCategoryForm
)
router.post('/admin/categories/create',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.createCategory)
)
router.get('/admin/categories/edit/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.editCategoryForm)
)
// todo: editing
router.post('/admin/categories/edit/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.editCategory)
)
router.post('/admin/categories/delete/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.deleteCategory)
)

router.get('/admin/products/create',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  adminController.createProductForm
)
router.post('/admin/products/create',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.createProduct)
)
router.get('/admin/products/edit/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.editProductForm)
)
// todo: editing
router.post('/admin/products/edit/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.editProduct)
)
router.post('/admin/products/delete/:id',
  authController.isLoggedIn,
  adminController.adminPrivilege('can_edit_store'),
  catchAsyncErrors(adminController.deleteProduct)
)

module.exports = router
