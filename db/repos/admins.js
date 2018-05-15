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
  createAdminRequest (username, password) {
    return this.db.any(sql.createAdminRequest, [username, password])
  }
}

module.exports = AdminsRepository
