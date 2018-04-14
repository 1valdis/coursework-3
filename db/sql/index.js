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
    bySessionID: sql('baskets/bySessionID.sql')
  }
}

function sql (file) {
  const options = {
    minify: true
  }
  return new QueryFile(path.join(__dirname, file), options)
}