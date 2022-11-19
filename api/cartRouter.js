const express = require('express');

const cartRouter = express.Router();

cartRouter.get('/', (req, res, next) => {
  res.send('YOUR CART')
})

// cartRouter.post('')
// add product to user specific cart


module.exports = cartRouter;
