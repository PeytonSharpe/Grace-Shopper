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
} = require ('../db');

categoriesRouter.get('/', async (req, res, next) => {
    try {

        const allCategories = await getAllCategories();
        res.send(allCategories)
    } catch (error) {
        console.error ('categoriesRouter.get-categoriesRouter.js FAILED', error)
    }
    
});

categoriesRouter.get('/:category', async (req, res, next) => {
    try {
        const { category } = req.params;
        const categoryProducts = await getProductByCategory(category);
        res.send(categoryProducts)
    } catch (error) {
        console.error ('categoriesRouter.get-categoriesRouter.js FAILED', error)
    }
    
});

categoriesRouter.post('/create-category', async (req, res, next) => {
    const { name, description } = req.body

    try{
        const category = await getCategoryByName(name);

        if (category) {
            next({
                error: 'api error',
                name: 'CategoryExistsError',
                message: `Category ${name} already exists.`
            });
        }
        const newCat = await createCategory({
            name, 
            description
        });
        res.send({
            message:`Category ${name} created!`
        });
    } catch ({ name, message }) {
        next({ name, message })
    }
});


categoriesRouter.patch('/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }

    try {
        
        const updatedCategory = await updateCategory (categoryId, updateFields)

        if (updatedCategory) {
            res.send(updatedCategory)
        } else {
        res.send ({message:`Error updating category`})
        }
        
    } catch (error) {
        console.log('categoriesRouter.patch FAILED', error)
    }

})

categoriesRouter.delete('/:categoryId', async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const deletedCategory = await deleteCategory(categoryId)

        if(deletedCategory) {
            res.send({
                message:'This Category was deleted.'
            })
            } else {
              res.send('Error deleting Category.')
            }
          } catch (err) {
            console.log('categoriesRouter.delete FAILED', err)
          }
});

module.exports = categoriesRouter;