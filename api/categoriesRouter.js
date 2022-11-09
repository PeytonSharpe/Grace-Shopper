const express = require('express');

const categoriesRouter = express.Router();

categoriesRouter.get('/categories', (req, res, next) => {
  res.send('CATEGORIES')
});

categoriesRouter.post('/create-category', (req, res, next) => {
    res.send('Create category admin only')
})

categoriesRouter.patch('/edit-category', (req, res, next) => {
    res.send('Edit category admin only')
})

categoriesRouter.delete('/edit-category', (req, res, next) => {
    res.send('Delete category admin only')
})

module.exports = categoriesRouter;