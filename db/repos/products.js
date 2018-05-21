const sql = require('../sql').products

class ProductsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  byCategory (id) {
    return this.db.any(sql.byCategory, id)
  }
  byId (id) {
    return this.db.one(sql.byId, id)
  }
  byIds (idArray) {
    return this.db.any(sql.byIds, {idArray})
  }
  create (product) {
    return this.db.one(sql.create, product).then(data => data.id)
  }
  updateById (id, product) {
    product.id = id
    if (product.image === undefined) {
      return this.db.any(sql.updateByIdWithoutImage, product)
    } else {
      return this.db.any(sql.updateByIdWithImage, product)
    }
  }
  deleteById (id) {
    return this.db.any(sql.deleteById, id)
  }
}

module.exports = ProductsRepository
