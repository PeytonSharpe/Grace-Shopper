const express = require('express');
const jwt = require('jsonwebtoken');
const apiRouter = express.Router();
const {
  getUserById
  
} = require('../db')
// GET /api/health
apiRouter.get('/health', async (req, res, next) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: 'All is well',
      timestamp: Date.now()
    });
    next()
  });

apiRouter.use(async (req, res, next) => {
  console.log("in API Router")
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          console.log("user has been found")
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
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

// const singleProduct = require('./singleProduct');
// apiRouter.use('/:productId', singleProduct);

const cartRouter = require('./cartRouter');
apiRouter.use('/cart', cartRouter);


apiRouter.use('*', (req, res) => {
  res.status(404).send({
    error: 'unknownpage',
    name: 'badURL',
    message: 'wrong route'
  });
})

apiRouter.use((error, req, res, next) => {

  res.send({
    error: error.error,
    name: error.name,
    message: error.message
  });
});
module.exports = apiRouter;
