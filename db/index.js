require('dotenv').config({ path: 'variables.env' })

const repos = require('./repos')

const pgp = require('pg-promise')({
  extend (obj, dc) {
    obj.products = new repos.Products(obj, pgp)
    obj.categories = new repos.Categories(obj, pgp)
    obj.discounts = new repos.Discounts(obj, pgp)
  }
})

const db = pgp(process.env.POSTGRES_CONNECTION_STRING)

module.exports = db
