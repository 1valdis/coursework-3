const sql = require('../sql').baskets

class BasketsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  bySessionID (id) {
    return this.db.any(sql.bySessionId, id)
  }
}

module.exports = BasketsRepository
