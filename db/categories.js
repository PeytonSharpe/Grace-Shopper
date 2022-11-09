const { client } = require('./');

async function createCategory({name, description}) {
  try {
    const { rows: [category]} = await client.query(`
      INSERT INTO categories (name, description, )
      VALUES ($1, $2)
      RETURNING *;
    `, [name, description])
    
    return category;
  }
  catch(ex) {
    console.log('error in createCategory adapter function')
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
    console.error("Error in updateCategory function")
    throw error
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
      console.error("getAllCategories FAILED:", error);
    }
  }

async function deleteCategory(id) {
    
    try {
        const { rows: [ category ] } = await client.query(`
        DELETE FROM categories
        WHERE categories.id=$1;
    `, [ id ]);    
        
        return [category];
    }
    catch (err) {
        console.error('destroyRoutine-routines.js FAILED:', err);
    }
        
}


module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,

}
