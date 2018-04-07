const path = require('path')

const QueryFile = require('pg-promise').QueryFile

module.exports = {
  categories: {
    all: sql('categories/all.sql'),
    byId: sql('categories/byId.sql')
  },
  products: {
    byCategory: sql('products/byCategory.sql'),
    byId: sql('products/byId.sql')
  },
  discounts: {
    all: sql('discounts/all.sql')
  }
}

function sql (file) {
  const options = {
    minify: true
  }
  return new QueryFile(path.join(__dirname, file), options)
}
