const db = require('./db');
(async () => {
  try {
    await db.query(new db.$config.pgp.QueryFile('./db/clearDatabase.sql'))
    console.log('Success')
  } catch (e) {
    console.log('Something is wrong')
  }
  process.exit(0)
})()
