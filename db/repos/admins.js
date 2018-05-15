const sql = require('../sql').admins

class AdminsRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }
  byId (id) {
    return this.db.oneOrNone(sql.byId, id)
  }
  byUsername (username) {
    return this.db.oneOrNone(sql.byUsername, username)
  }
}

module.exports = AdminsRepository
