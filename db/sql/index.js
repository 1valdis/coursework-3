const path = require('path')

const QueryFile = require('pg-promise').QueryFile

module.exports = {
  categories: {
    all: sql('categories/all.sql'),
    byId: sql('categories/byId.sql')
  },
  products: {
    byCategory: sql('products/byCategory.sql'),
    byId: sql('products/byId.sql'),
    byIds: sql('products/byIds.sql')
  },
  baskets: {
    bySessionId: sql('baskets/bySessionId.sql'),
    quantityBySessionId: sql('baskets/quantityBySessionId.sql'),
    sumBySessionId: sql('baskets/sumBySessionId.sql')
  },
  orders: {
    makeOrder: sql('orders/makeOrder.sql'),
    byId: sql('orders/byId.sql'),
    bySlug: sql('orders/bySlug.sql'),
    bySessionId: sql('orders/bySessionId.sql'),
    quantityBySessionId: sql('orders/quantityBySessionId.sql')
  },
  orderItems:{
    byOrderId: sql('order_items/byOrderId.sql'),
    byOrderSlug: sql('order_items/byOrderSlug.sql')
  }
}

function sql (file) {
  const options = {
    minify: true
  }
  return new QueryFile(path.join(__dirname, file), options)
}
