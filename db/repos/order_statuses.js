const sql = require('../sql').order_statuses

class OrderStatusesRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  all () {
    return this.db.any(sql.all)
  }
}

module.exports = OrderStatusesRepository
