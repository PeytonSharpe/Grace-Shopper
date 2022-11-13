const express = require('express');

const productsRouter = express.Router();

// const { getAllProducts, createProduct, editProduct, getProductById, getProductsByCategory, getProductByName } and whatever else we need
productsRouter.get('/', (req, res, next) => {
  res.send('LIST OF PRODUCTS')
});

productsRouter.post('/create-product', (req, res, next) => {
  res.send('Create product admin only')
});

productsRouter.patch('/edit-product', (req, res, next) => {
  res.send('Edit product admin only')
})

productsRouter.delete('/edit-product', (req, res, next) => {
  res.send('Delete product admin only')
});

module.exports = productsRouter;
