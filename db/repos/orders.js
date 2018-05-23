const sql = require('../sql').orders

class OrdersRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  /**
   * @typedef orderDetails
   * @property {string} sessionId
   * @property {string} firstname
   * @property {string} lastname
   * @property {string} patronymic
   * @property {string} phone
   * @property {string} address
   * @property {string} details
   */
  /**
   * @param {orderDetails} orderDetails
   */
  makeOrder (orderDetails) {
    return this.db.one(sql.makeOrder, orderDetails)
  }
  byId (id) {
    return this.db.one(sql.byId, id)
  }
  bySlug (slug) {
    return this.db.one(sql.bySlug, slug)
  }
  bySessionId (sessionId) {
    return this.db.any(sql.bySessionId, sessionId)
  }
  quantityBySessionId (sessionId) {
    return this.db.one(sql.quantityBySessionId, sessionId).then(data => data.quantity)
  }
  all () {
    return this.db.any(sql.all)
  }
  updateById (id, order_status) {
    return this.db.any(sql.updateById, {id, order_status})
  }
}

module.exports = OrdersRepository
