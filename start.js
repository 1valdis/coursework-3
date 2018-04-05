// environment variables (node_env, secret keys...)
require('dotenv').config({path: 'variables.env'})

const app = require('./app')
const db = require('./db')

app.set('port', process.env.PORT || 13375)
const server = app.listen(app.get('port'), () => {
  console.log(`Running on port ${server.address().port}`)
})
