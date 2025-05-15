const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct
} = require('../db/products.js');

const { getAllReviewsForProduct } = require('../db/reviews.js');
const { requireAdmin } = require('./utils');

const productsRouter = express.Router();

// GET /api/products - fetch all products + their reviews
productsRouter.get('/', async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();

    if (!allProducts.length) {
      return res.status(404).json({ message: 'No products found.' });
    }

    // Fetch reviews concurrently for all products
    const productsWithReviews = await Promise.all(
      allProducts.map(async (product) => {
        const reviews = await getAllReviewsForProduct({ productId: product.id });
        return { ...product, reviews };
      })
    );

    res.json(productsWithReviews);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - create a new product (admin only)
productsRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, description, price, count, image } = req.body;

    // Basic validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string.' });
    }
    if (price == null || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price is required and must be a non-negative number.' });
    }
    if (count == null || typeof count !== 'number' || count < 0) {
      return res.status(400).json({ error: 'Count is required and must be a non-negative number.' });
    }
    // description and image are optional but if present, validate types
    if (description && typeof description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string.' });
    }
    if (image && typeof image !== 'string') {
      return res.status(400).json({ error: 'Image must be a string (URL).' });
    }

    const product = await createProduct({ title, description, price, count, image });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/products/:productId - update product fields (admin only)
productsRouter.patch('/:productId', requireAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { title, description, price, count, image } = req.body;
    const updateFields = {};

    if (title !== undefined) {
      if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string.' });
      }
      updateFields.title = title;
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({ error: 'Description must be a string.' });
      }
      updateFields.description = description;
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number.' });
      }
      updateFields.price = price;
    }

    if (count !== undefined) {
      if (typeof count !== 'number' || count < 0) {
        return res.status(400).json({ error: 'Count must be a non-negative number.' });
      }
      updateFields.count = count;
    }

    if (image !== undefined) {
      if (typeof image !== 'string') {
        return res.status(400).json({ error: 'Image must be a string (URL).' });
      }
      updateFields.image = image;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    const updatedProduct = await updateProduct(productId, updateFields);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:productId - delete product (admin only)
productsRouter.delete('/:productId', requireAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found or already deleted.' });
    }

    res.json({ message: 'Product deleted successfully.', product: deletedProduct });
  } catch (err) {
    next(err);
  }
});

module.exports = productsRouter;
