const sql = require('../sql').orderItems

class OrderItemsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }
  
  byOrderId(orderId){
    return this.db.many(sql.byOrderId, orderId)
  }
  byOrderSlug(orderSlug){
    return this.db.many(sql.byOrderSlug, orderSlug)
  }
}

module.exports = OrderItemsRepository
