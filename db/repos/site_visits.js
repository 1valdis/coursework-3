const sql = require('../sql').site_visits

class SiteVisitsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  add (url) {
    return this.db.any(sql.add, url)
  }
}

module.exports = SiteVisitsRepository
