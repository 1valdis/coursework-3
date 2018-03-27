const path = require('path')

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')

const routes = require('./routes/index')
const errorHandlers = require('./handlers/errorHandlers')

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

// session for flashes
// TODO kool session in Postgres
app.use(
  session({
    secret: process.env.SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    cookie: { secure: true },
    resave: false,
    saveUninitialized: false,
    rolling: true
  })
)

// pass flashes to our templates
app.use((req, res, next) => {
  res.locals.flashes = req.flash()
})

// after all, routes
app.use('/', routes)

// if none of the above worked, 404
app.use(errorHandlers.notFound)

// let's see if this is just a validation error
app.use(errorHandlers.flashValidationErrors)

if (app.get('env') === 'development') {
  // Development error handler - prints stack trace
  app.use(errorHandlers.developmentErrors)
}

// done! now export it to start from start.js
module.exports = app
