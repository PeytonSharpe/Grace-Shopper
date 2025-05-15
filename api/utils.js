const express = require('express');
const jwt = require('jsonwebtoken');
const os = require('os');

const apiRouter = express.Router();
const { getUserById } = require('../db');

// Health check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: Date.now(),
    hostname: os.hostname(),
    version: '1.0.0'
  });
});

// Authentication middleware
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) return next();

  if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Authenticated user ID: ${id}`);
        }
        return next();
      }
    } catch (error) {
      return next({
        name: error.name || 'TokenError',
        message: error.message || 'Invalid token'
      });
    }
  } else {
    return next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    });
  }
});

// Subrouters
apiRouter.use('/users', require('./usersRouter'));
apiRouter.use('/products', require('./productsRouter'));
apiRouter.use('/categories', require('./categoriesRouter'));
apiRouter.use('/address', require('./addressRouter'));
apiRouter.use('/reviews', require('./reviewsRouter'));
apiRouter.use('/cart', require('./cartRouter'));

// 404 handler
apiRouter.use('*', (req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: '404 Not Found'
  });
});

// Global error handler
apiRouter.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: error.name || 'InternalServerError',
    message: error.message || 'Internal server error'
  });
});

module.exports = apiRouter;
// This code is a part of an Express.js API router that handles authentication, health checks, and routing to various subroutes for users, products, categories, address, reviews, and cart. It also includes error handling for 404 Not Found and internal server errors. The authentication middleware verifies JWT tokens and attaches the user object to the request if valid.
// The health check endpoint returns the server's status, uptime, timestamp, hostname, and version. The router uses async/await for asynchronous operations and includes console logging for debugging in development mode.