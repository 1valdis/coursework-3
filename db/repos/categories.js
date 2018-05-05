const sql = require('../sql').categories

class ProductsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  all () {
    return this.db.any(sql.all)
  }
  byId (id) {
    return this.db.one(sql.byId, id)
  }
}

module.exports = ProductsRepository
