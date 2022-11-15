const express = require('express');

const apiRouter = express.Router();
// GET /api/health
apiRouter.get('/health', async (req, res, next) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: 'All is well',
      timestamp: Date.now()
    });
    next()
  });

const usersRouter = require('./usersRouter');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./productsRouter');
apiRouter.use('/products', productsRouter);

const categoriesRouter = require('./categoriesRouter');
apiRouter.use('/categories', categoriesRouter);

const addressRouter = require('./addressRouter');
apiRouter.use('/address', addressRouter);

// const singleProduct = require('./singleProduct');
// apiRouter.use('/:productId', singleProduct);

const cartRouter = require('./cartRouter');
apiRouter.use('/cart', cartRouter);

module.exports = apiRouter;
