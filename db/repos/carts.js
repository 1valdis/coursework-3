const sql = require('../sql').carts

class CartsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  bySessionId (id) {
    return this.db.any(sql.bySessionId, id)
  }

  quantityBySessionId (id) {
    return this.db.one(sql.quantityBySessionId, id).then(data=>data.quantity)
  }

  addToCart (session_id, product_id, quantity) {
    return this.db.proc('add_to_cart', [session_id, product_id, quantity])
  }

  removeFromCart (session_id, product_id, quantity) {
    if (quantity === undefined) {
      return this.db.proc('remove_from_cart', [session_id, product_id])
    } else {
      return this.db.proc('remove_from_cart', [
        session_id,
        product_id,
        quantity
      ])
    }
  }

  sumBySessionId (session_id) {
    return this.db.one(sql.sumBySessionId, session_id).then(data=>data.sum)
  }
}

module.exports = CartsRepository
