const db = require('../db')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await db.admins.byUsername(username)
    if (user && await bcrypt.compare(password, user.password)) {
      return done(null, user)
    }
    done(null, false)
  } catch (e) {
    done(e)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.admins.byId(id)
    if (!user) {
      return done(null, false)
    }
    // TODO: verification
    return done(null, user)
  } catch (e) {
    return done(e)
  }
})
