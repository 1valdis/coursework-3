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
}

module.exports = ProductsRepository
