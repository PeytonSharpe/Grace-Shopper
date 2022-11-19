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
} = require ('../db');

categoriesRouter.get('/', async (req, res, next) => {
    try {

        const allCategories = await getAllCategories();
        res.send(allCategories)
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

// NEED TO FINISH
// categoriesRouter.patch('/edit-category', async (req, res, next) => {
//     const { name, description } = req.body;
//     const updateFields = {};

//     if (name) {
//         updateFields.name = name;
//     }

//     if (description) {
//         updateFields.description = description;
//     }

//     try {
//         const Category = await getCategoryByName(name)
//         const editedCategory = await updateCategory (updateFields)
//         res.send({
//             message:``
//         })
        
//     }

// })

categoriesRouter.delete('/edit-category', (req, res, next) => {
    res.send('Delete category admin only')
})

module.exports = categoriesRouter;