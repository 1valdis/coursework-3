# coursework-3

This is my course work for the 3rd year. Demo [here](https://kursach3.squad47.tk).

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

It's an online store. Features:
* Product categories
* Cart
* Admin page behind login
* Store (product and categories), admins and orders CRUD from admin pages
* Hashed passwords

## Built with
* [Express](http://expressjs.com/) - as a main router
* [PostgreSQL](https://www.postgresql.org/) - as a main RDBMS
* [pg-promise](https://github.com/vitaly-t/pg-promise) - as a library for async work with PostgreSQL
* [Redis](https://redis.io/) - for fast sessions
* [Passport](http://www.passportjs.org/) - for admins login
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - for secure password hashing
* [Multer](https://github.com/expressjs/multer) - for category/product image uploads
* [Pug](https://pugjs.org/) - as a templating engine
