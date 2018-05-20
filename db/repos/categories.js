const sql = require('../sql').categories

class CategoriesRepository {
  constructor (db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  all () {
    return this.db.any(sql.all)
  }
  byId (id) {
    return this.db.one(sql.byId, id)
  }
  create (name, description, image) {
    return this.db.one(sql.create, {
      name,
      description,
      image
    }).then(data => data.id)
  }
  deleteById (id) {
    return this.db.any(sql.deleteById, id)
  }
}

module.exports = CategoriesRepository
