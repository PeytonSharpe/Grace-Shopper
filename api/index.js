const express = require('express');

const apiRouter = express.Router();

const usersRouter = require('./usersRouter');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./productsRouter');
apiRouter.use('/products', productsRouter);

const categoriesRouter = require('./categoriesRouter');
apiRouter.use('/categories', categoriesRouter);

const singleProduct = require('./singleProduct');
apiRouter.use('/:productId', singleProduct);

const cartRouter = require('./cartRouter');
const categoriesRouter = require('./categoriesRouter');
apiRouter.use('/cart', cartRouter);

module.exports = apiRouter;
