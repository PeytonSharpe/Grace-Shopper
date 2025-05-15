const { client } = require('./client');

async function createCategory({ name, description }) {
  try {
    const { rows: [category] } = await client.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `, [name, description]);

    return category;
  } catch (error) {
    console.error('createCategory-categories.js FAILED', error);
    throw error;
  }
}

async function updateCategory(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (!setString.length) {
    return;
  }

  try {
    const { rows: [category] } = await client.query(`
      UPDATE categories
      SET ${setString}
      WHERE id = $${Object.keys(fields).length + 1}
      RETURNING *;
    `, [...Object.values(fields), id]);

    return category;
  } catch (error) {
    console.error("updateCategory-categories.js FAILED", error);
    throw error;
  }
}

async function getAllCategories() {
  try {
    const { rows } = await client.query(`
      SELECT id, name, description
      FROM categories;
    `);

    return rows;
  } catch (error) {
    console.error("getAllCategories-categories.js FAILED:", error);
    throw error;
  }
}

async function getCategoryById(categoryId) {
  try {
    const { rows: [category] } = await client.query(`
      SELECT *
      FROM categories
      WHERE id=$1;
    `, [categoryId]);

    return category;
  } catch (err) {
    console.error('getCategoryById-categories.js FAILED', err);
    throw err;
  }
}

async function deleteCategory(id) {
  try {
    // Delete references in prod_categories first (if any)
    await client.query(`
      DELETE FROM prod_categories
      WHERE "categoryId" = $1;
    `, [id]);

    const { rows: [category] } = await client.query(`
      DELETE FROM categories
      WHERE id=$1
      RETURNING *;
    `, [id]);

    return category;
  } catch (error) {
    console.error('deleteCategory-categories.js FAILED:', error);
    throw error;
  }
}

async function getCategoryByName(catName) {
  try {
    const { rows: [category] } = await client.query(`
      SELECT *
      FROM categories
      WHERE name=$1;
    `, [catName]);

    return category;
  } catch (error) {
    console.error('getCategoryByName-categories.js FAILED', error);
    throw error;
  }
}

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  getCategoryByName,
};
// Test the functions
// (async () => {