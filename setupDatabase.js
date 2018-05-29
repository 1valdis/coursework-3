const db = require('./db')
const bcrypt = require('bcrypt');

(async () => {
  try {
    await db.query(new db.$config.pgp.QueryFile('./db/setupDatabase.sql'))
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await db.any(`insert into admins(username, password, can_edit_admins, can_edit_store, can_manage_orders) values($1, $2, true, true, true)`, [process.env.ADMIN_USERNAME, hash])
    console.log('Success')
  } catch (e) {
    console.log(e)
  }
  process.exit(0)
})()
