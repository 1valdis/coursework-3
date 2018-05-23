const path = require('path')

const express = require('express')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const db = require('./db')

const passport = require('passport')
require('./handlers/passport')

const routes = require('./routes/index')
const errorHandlers = require('./handlers/errorHandlers')
const helpers = require('./helpers')

// creating express app
const app = express()

// trust our nginx reverse proxy
app.set('trust proxy', '127.0.0.1')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

// take raw requests and turn them into usable props of req.body
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
// for cookies too
app.use(cookieParser())

// methods for data validation
app.use(expressValidator())

// session for flashes and cart
app.use(
  session({
    store: new RedisStore({
      host: process.env.REDIS_IP,
      port: process.env.REDIS_PORT,
      logErrors: true,
      ttl: 60 * 60 * 24 * 3 // 3 days
    }),
    secret: process.env.SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    // if we're developing, cookie must not be secure for session to work, because we don't have https on localhost
    cookie: { secure: app.get('env') !== 'development' },
    resave: false,
    saveUninitialized: false,
    rolling: true//, // for debug purposes
    // unset: 'destroy'
  })
)

// The flash middleware lets us req.flash('error', 'SOMETHING IS WRONG!'), which will pass the message to the next page
app.use(flash())

// Passport is to authenticate admins
app.use(passport.initialize())
app.use(passport.session())

// pass flashes to our templates
app.use(async (req, res, next) => {
  res.locals.h = helpers
  res.locals.flashes = req.flash()
  res.locals.currentPath = req.path
  res.locals.user = req.user || null
  res.locals.countInCart = await db.carts.quantityBySessionId(req.session.id)
  res.locals.ordersCount = await db.orders.quantityBySessionId(req.session.id)
  next()
})

// after all, routes
app.use('/', routes)

// if that's an error with a typeof==='string', flash it and redirect back
app.use(errorHandlers.textError)

// if none of the above worked, 404
app.use(errorHandlers.notFound)

// let's see if this is just a validation error
// app.use(errorHandlers.flashValidationErrors)

if (app.get('env') === 'development') {
  // Development error handler - prints stack trace
  app.use(errorHandlers.developmentErrors)
  process.on('uncaughtException', e => {
    console.error(e.name, e.message, e.stack)
    process.exit(1)
  })
}

// production error handler
app.use(errorHandlers.productionErrors)

// done! now export it to start from start.js
module.exports = app
