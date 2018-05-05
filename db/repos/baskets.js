const sql = require('../sql').baskets

class BasketsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  bySessionId (id) {
    return this.db.any(sql.bySessionId, id)
  }

  quantityBySessionId (id) {
    return this.db.one(sql.quantityBySessionId, id)
  }

  addToBasket (session_id, product_id, quantity) {
    return this.db.proc('add_to_basket', [session_id, product_id, quantity])
  }

  removeFromBasket (session_id, product_id, quantity) {
    if (quantity === undefined) {
      return this.db.proc('remove_from_basket', [session_id, product_id])
    } else {
      return this.db.proc('remove_from_basket', [
        session_id,
        product_id,
        quantity
      ])
    }
  }

  sumBySessionId (session_id) {
    return this.db.one(sql.sumBySessionId, session_id)
  }
}

module.exports = BasketsRepository
