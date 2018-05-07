require('dotenv').config({ path: 'variables.env' })

const repos = require('./repos')

const pgp = require('pg-promise')({
  extend (obj, dc) {
    obj.products = new repos.Products(obj, pgp)
    obj.categories = new repos.Categories(obj, pgp)
    obj.baskets = new repos.Baskets(obj, pgp)
    obj.orders = new repos.Orders(obj, pgp)
    obj.orderItems = new repos.OrderItems(obj, pgp)
  }
})

// the standard string-to-Date conversion uses local time, not UTC. Let's fix it.
pgp.pg.types.setTypeParser(1114, datestring => new Date(datestring+'Z'))

const db = pgp(process.env.POSTGRES_CONNECTION_STRING)

module.exports = db
