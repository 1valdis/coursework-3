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
  allAdmins () {
    return this.db.any(sql.allAdmins)
  }
  allRequests () {
    return this.db.any(sql.allRequests)
  }
  approveRequest (request) {
    return this.db.any(sql.approveRequest, request)
  }
  deleteRequest (id) {
    return this.db.any(sql.deleteRequest, id)
  }
  editAdmin (data) {
    return this.db.any(sql.editAdmin, data)
  }
  deleteAdmin (id) {
    return this.db.any(sql.deleteAdmin, id)
  }
}

module.exports = AdminsRepository
