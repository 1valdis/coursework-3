const sql = require('../sql').stats

class StatsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  addSiteVisit (url) {
    return this.db.any(sql.addSiteVisit, url)
  }
  siteVisits () {
    return this.db.any(sql.siteVisits)
  }
  addProductVisit (id) {
    return this.db.any(sql.addProductVisit, id)
  }
  productVisits () {
    return this.db.any(sql.productVisits)
  }
  orders () {
    return this.db.any(sql.orders)
  }
  carts () {
    return this.db.any(sql.carts)
  }
}

module.exports = StatsRepository
