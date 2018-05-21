const router = require('express').Router()

const storeController = require('../controllers/storeController')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')

const { catchAsyncErrors } = require('../handlers/errorHandlers')

// store

router
  .get('/', storeController.getIndex)
  .get('/catalogue', catchAsyncErrors(storeController.getCatalogue))
  .get('/categories/:id', catchAsyncErrors(storeController.getProductsByCategory))
  .get('/products/:id', catchAsyncErrors(storeController.getProductById))

  .get('/cart', catchAsyncErrors(storeController.getCart))
  .post('/cart/add', catchAsyncErrors(storeController.addToCart))
  .post('/cart/remove', catchAsyncErrors(storeController.removeFromCart))

  .post('/order', catchAsyncErrors(storeController.createOrder))
  .get('/orders', catchAsyncErrors(storeController.getOrders))
  .get('/orders/:slug', catchAsyncErrors(storeController.getOrderBySlug))

  .get('/warranty', storeController.getWarranty)
  .get('/delivery', storeController.getDelivery)
  .get('/about', storeController.getAbout)

// admin panel

  .get('/login', adminController.loginForm)
  .post('/login', adminController.validateLoginForm, authController.login)
  .post('/request', adminController.validateLoginForm, catchAsyncErrors(adminController.accessRequest))
  .get('/logout', authController.logout)

  .get('/admin', authController.isLoggedIn, adminController.adminPage)
// let's go head-on right now and then will make a bit DRYer after it all wraps up
// or will we? "keep it simple, stupid"...

// categories CrUD
  .get('/admin/categories/create',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    adminController.createCategoryForm
  )
  .post('/admin/categories/create',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    adminController.upload,
    adminController.validateCategoryForm,
    catchAsyncErrors(adminController.createCategory)
  )
  .get('/admin/categories/edit/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    catchAsyncErrors(adminController.editCategoryForm)
  )
  .post('/admin/categories/edit/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    adminController.upload,
    adminController.validateCategoryForm,
    catchAsyncErrors(adminController.editCategory)
  )
  .post('/admin/categories/delete/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    catchAsyncErrors(adminController.deleteCategory)
  )
// products CrUD
  .get('/admin/products/create',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    catchAsyncErrors(adminController.createProductForm)
  )
  .post('/admin/products/create',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    adminController.upload,
    adminController.validateProductFrom,
    catchAsyncErrors(adminController.createProduct)
  )
  .get('/admin/products/edit/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    catchAsyncErrors(adminController.editProductForm)
  )
  .post('/admin/products/edit/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    adminController.upload,
    adminController.validateProductFrom,
    catchAsyncErrors(adminController.editProduct)
  )
  .post('/admin/products/delete/:id',
    authController.isLoggedIn,
    adminController.adminPrivilege('can_edit_store'),
    catchAsyncErrors(adminController.deleteProduct)
  )

module.exports = router
