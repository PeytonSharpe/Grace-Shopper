const { client } = require('./client');

async function createCategory({name, description}) {
  try {
    const { rows: [category]} = await client.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `, [name, description])
    
    return category;
  }
  catch(error) {
    console.error('createCategory-categories.js FAILED', error)
  }
}

async function updateCategory(id, fields = {}
)   {
    const setString = Object.keys(fields).map((key, index)=> 
  `"${key}"=$${index + 1}`).join(",")

  if (setString === 0){
    return
  }

  try {
    const {rows : [category] } = await client.query(`
    UPDATE categories
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `, Object.values(fields))

    return category
  } catch (error) {
    console.error("updateCategory-categories.js FAILED", error);
  }
}

async function getAllCategories() {
    try {
      const { rows } = await client.query(`
    SELECT id, name, description
    FROM categories;
    `);
     
      return rows;
    }
    catch (error) {
      console.error("getAllCategories-categories.js FAILED:", error);
    }
  }

  async function getCategoryById(categoryId) {
    try {
      const {rows: [categories] } = await client.query(`
          SELECT *
          FROM categories
          WHERE id=${categoryId}
          `, [id]);
  
          return categories;
      } catch(err) {
          console.log('getCategoryById-categories.js FAILED', err);
      }
  };

async function deleteCategory(id) {
    console.log(id)
    try {
        const { rows: [ category ] } = await client.query(`
        DELETE FROM categories
        WHERE categories.id=$1
        RETURNING *;
    `, [ id ]);    
        
        return category;
    }
    catch (error) {
        console.error('deleteCategory-categories.js FAILED:', error);
    }
        
}

async function getCategoryByName(catName) {
    try {
        const { rows: [ name ] } = await client.query (`
        SELECT *
        FROM categories
        WHERE name=$1;
        `, [catName]);

        return name;
    }
    catch (error) {
        console.error('getCategoryByName-categories.js FAILED', error)
    }
}


module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getCategoryByName,

}