const db = require('../db')

exports.loginForm = (req, res)=>{
  res.render('login', {title: 'Вход'})
}
