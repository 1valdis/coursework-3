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
  updateById (id, name, description, image) {
    if (image === undefined) {
      return this.db.any(sql.updateByIdWithoutImage, {id, name, description})
    } else {
      return this.db.any(sql.updateByIdWithImage, {id, name, description, image})
    }
  }
  deleteById (id) {
    return this.db.any(sql.deleteById, id)
  }
}

module.exports = CategoriesRepository
