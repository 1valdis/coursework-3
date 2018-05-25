const path = require('path')

const QueryFile = require('pg-promise').QueryFile

module.exports = {
  categories: {
    all: sql('categories/all.sql'),
    byId: sql('categories/byId.sql'),
    create: sql('categories/create.sql'),
    updateByIdWithImage: sql('categories/updateByIdWithImage.sql'),
    updateByIdWithoutImage: sql('categories/updateByIdWithoutImage.sql'),
    deleteById: sql('categories/deleteById.sql')
  },
  products: {
    byCategory: sql('products/byCategory.sql'),
    byId: sql('products/byId.sql'),
    byIds: sql('products/byIds.sql'),
    create: sql('products/create.sql'),
    updateByIdWithImage: sql('products/updateByIdWithImage.sql'),
    updateByIdWithoutImage: sql('products/updateByIdWithoutImage.sql'),
    deleteById: sql('products/deleteById.sql')
  },
  carts: {
    bySessionId: sql('carts/bySessionId.sql'),
    quantityBySessionId: sql('carts/quantityBySessionId.sql'),
    sumBySessionId: sql('carts/sumBySessionId.sql')
  },
  orders: {
    makeOrder: sql('orders/makeOrder.sql'),
    byId: sql('orders/byId.sql'),
    bySlug: sql('orders/bySlug.sql'),
    bySessionId: sql('orders/bySessionId.sql'),
    quantityBySessionId: sql('orders/quantityBySessionId.sql'),
    all: sql('orders/all.sql'),
    updateById: sql('orders/updateById.sql')
  },
  order_statuses: {
    all: sql('order_statuses/all.sql')
  },
  orderItems: {
    byOrderId: sql('order_items/byOrderId.sql'),
    byOrderSlug: sql('order_items/byOrderSlug.sql')
  },
  admins: {
    byId: sql('admins/byId.sql'),
    byUsername: sql('admins/byUsername.sql'),
    createAdminRequest: sql('admins/createAdminRequest.sql'),
    allAdmins: sql('admins/allAdmins.sql'),
    allRequests: sql('admins/allRequests.sql'),
    approveRequest: sql('admins/approveRequest.sql'),
    deleteRequest: sql('admins/deleteRequest.sql'),
    editAdmin: sql('admins/editAdmin'),
    deleteAdmin: sql('admins/deleteAdmin.sql')
  },
  site_visits: {
    add: sql('site_visits/add.sql'),
    stats: sql('site_visits/stats.sql')
  }
}

function sql (file) {
  const options = {
    minify: true
  }
  return new QueryFile(path.join(__dirname, file), options)
}
