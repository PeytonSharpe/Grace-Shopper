const express = require('express');
const { 
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct } = require('../../db');

const { requireAdmin } = require('./utils');

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts)
  } catch (err) {
    console.log('productsRouter.get-productsRouter.js FAILED', err)
  }
});

productsRouter.post('/create-product', requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct({
      title,
      description,
      price,
      count
    })

    if (product) {
      res.send(product)
    }
  } catch (err) {
    console.log('productsRouter.post FAILED', err)
  }
});

productsRouter.patch('/:productId', requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { title, description, price, count } = req.body;
  const updateFields = {};

  if (title) {
    updateFields.title = title;
  }

  if (description) {
    updateFields.description = description
  }

  if (price) {
    updateFields.price = price;
  }

  if (count) {
    updateFields.count = count;

  }
  try {
    const updatedProduct = await updateProduct(productId, updateFields)

    if (updatedProduct) {
      res.send(updatedProduct)
    }
  } catch (err) {
    console.log('productsRouter.patch FAILED', err)
  }
});

productsRouter.delete('/:productId', requireAdmin, async (req, res, next) => {
  try {
    const product = await getProductById(productId)
    const deletedProduct = await deleteProduct(product.id, { active: false })

    res.send(deletedProduct)
    console.log('This product was deleted.')
  } catch (err) {
    console.log('productRouter.delete FAILED', err)
  }
});

module.exports = productsRouter;
