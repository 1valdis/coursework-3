const db = require('./db');
(async () => {
  try {
    await db.query(new db.$config.pgp.QueryFile('./db/setupDatabase.sql'))
    console.log('Success')
  } catch (e) {
    console.log('Error. Maybe db is already set up?')
  }
  process.exit(0)
})()
