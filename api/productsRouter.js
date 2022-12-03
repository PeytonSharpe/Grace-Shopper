const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct } = require('../db/products.js');
 

const { requireAdmin } = require('./utils');

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  console.log('in products route')
  console.log(typeof getAllProducts,'Products')
  try {
    const allProducts = await getAllProducts();
    console.log(allProducts,'allprods')
    if (!allProducts) {
      res.send('No products found.')
    }
    res.send(allProducts)

   
  } catch (err) {
    console.log('productsRouter.get-productsRouter.js FAILED', err)
    next(err)
  }
});

productsRouter.post('/create-product', requireAdmin, async (req, res, next) => {
  try {
    console.log(req.body)
    console.log('In Products Router Testing')
    const {title, description, price, count, image}= req.body
    console.log(title)
    const product = await createProduct({
      title,
      description,
      price,
      count,
      image     
    })

      res.send(product)
    
  } catch (err) {
    console.log('productsRouter.post FAILED', err)
    next(err)
  }
});

productsRouter.patch('/:productId', requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { title, description, price, count, image } = req.body;
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

  if(image) {
    updateFields.image = image;
  }
  try {
    const updatedProduct = await updateProduct(productId, updateFields)

    if (updatedProduct) {
      res.send(updatedProduct)
    } else {
      res.send('Error updating product.')
    }
  } catch (err) {
    console.log('productsRouter.patch FAILED', err)
    next(err)
  }
});

productsRouter.delete('/:productId', requireAdmin, async (req, res, next) => {
  try {
    console.log('in delete product')
    const { productId } = req.params;    
    const deletedProduct = await deleteProduct(productId)

    if (deletedProduct) {
      res.send(deletedProduct)
    } else {
      res.send('Error deleting product.')
    }
  } catch (err) {
    console.log('productRouter.delete FAILED', err)
    next(err)
  }
});

module.exports = productsRouter;
