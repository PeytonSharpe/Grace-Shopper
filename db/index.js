module.exports = {
    ...require('./client'), // adds key/values from users.js
    ...require('./users'), // adds key/values from users.js
    ...require('./products'),
    ...require('./addresses'),
    ...require('./cart'),
    ...require('./categories')
  }