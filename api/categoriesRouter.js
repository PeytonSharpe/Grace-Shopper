const express = require('express');
const categoriesRouter = express.Router();

const { requireUser } = require("./utils");

const {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getCategoryByName,
  getProductByCategory
} = require('../db');

// GET /api/categories/
categoriesRouter.get('/', async (req, res, next) => {
  try {
    const allCategories = await getAllCategories();
    res.send(allCategories);
  } catch (error) {
    next(error); // Use next to propagate errors to middleware
  }
});

// GET /api/categories/:category
categoriesRouter.get('/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryProducts = await getProductByCategory(category);
    if (categoryProducts.length === 0) {
      return res.status(404).send({ message: `No products found for category: ${category}` });
    }
    res.send(categoryProducts);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories/create-category
categoriesRouter.post('/create-category', requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await getCategoryByName(name);

    if (existingCategory) {
      return next({
        name: 'CategoryExistsError',
        message: `Category '${name}' already exists.`
      });
    }

    const newCategory = await createCategory({ name, description });

    res.send({
      message: `Category '${name}' created!`,
      category: newCategory
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/categories/:categoryId
categoriesRouter.patch('/:categoryId', requireUser, async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;

  try {
    const updatedCategory = await updateCategory(categoryId, updateFields);

    if (updatedCategory) {
      res.send(updatedCategory);
    } else {
      res.status(404).send({ message: "Category not found or update failed." });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:categoryId
categoriesRouter.delete('/:categoryId', requireUser, async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const deletedCategory = await deleteCategory(categoryId);

    if (deletedCategory) {
      res.send({ message: 'Category deleted successfully.', category: deletedCategory });
    } else {
      res.status(404).send({ message: 'Category not found or already deleted.' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = categoriesRouter;
