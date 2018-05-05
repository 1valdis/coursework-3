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
}

module.exports = OrdersRepository
