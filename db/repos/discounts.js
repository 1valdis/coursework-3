const sql = require('../sql').discounts

class ProductsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  all () {
    return this.db.any(sql.all)
  }
}

module.exports = ProductsRepository
