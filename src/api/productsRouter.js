const express = require('express');
const { getAllProducts, createProduct } = require('../db');
const { requireAdmin } = require('./utils');

const productsRouter = express.Router();

// const { getAllProducts, createProduct, editProduct, getProductById, getProductsByCategory, getProductByName } and whatever else we need
productsRouter.get('/', async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts)
  } catch(err) {
    console.log('productsRouter.get-productsRouter.js FAILED', err)
  }
});

productsRouter.post('/create-product', requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(requireAdmin)
    if(product) {
      res.send(product)
    } else {
      next({
        name: 'CreateProductError',
        message: 'Error creating product'
      })
    }
  } catch(err) {
    console.log('productsRouter.post FAILED', err)
  }
});

productsRouter.patch('/edit-product', (req, res, next) => {
  res.send('Edit product admin only')
})

productsRouter.delete('/edit-product', (req, res, next) => {
  res.send('Delete product admin only')
});

module.exports = productsRouter;
