const express = require('express');
const jwt = require('jsonwebtoken');
const apiRouter = express.Router();
const { getUserById } = require('../db');

apiRouter.get('/health', async (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    message: 'All is well',
    timestamp: Date.now()
  });
});

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    return next();
  }

  if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        return next();
      }
    } catch ({ name, message }) {
      return next({ name, message });
    }
  } else {
    return next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    });
  }
});

const usersRouter = require('./usersRouter');
apiRouter.use('/users', usersRouter);

const productsRouter = require('./productsRouter');
apiRouter.use('/products', productsRouter);

const categoriesRouter = require('./categoriesRouter');
apiRouter.use('/categories', categoriesRouter);

const addressRouter = require('./addressRouter');
apiRouter.use('/address', addressRouter);

const reviewsRouter = require('./reviewsRouter');
apiRouter.use('/reviews', reviewsRouter);

const cartRouter = require('./cartRouter');
apiRouter.use('/cart', cartRouter);

apiRouter.use('*', (req, res) => {
  res.status(404).send({
    error: 'NotFound',
    message: '404 Not Found'
  });
});

apiRouter.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    name: error.name || 'InternalServerError',
    message: error.message || 'Something went wrong'
  });
});

module.exports = apiRouter;
// This code defines an Express router for an API. It includes a health check endpoint, middleware for authentication using JWT, and routes for users, products, categories, address, reviews, and cart. It also handles 404 errors and general error handling.
// The health check endpoint returns the server's uptime and a message. The authentication middleware checks for a valid JWT in the Authorization header and attaches the user object to the request if valid. If the token is invalid or missing, it calls the next middleware or returns an error. The router also includes error handling for 404 Not Found and other server errors.