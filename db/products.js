const { client } = require('./client');

async function getAllProducts() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM products;
    `)

    return rows;
  } catch (err) {
    console.log('getAllProducts-products.js FAILED', err)
  }
}

async function getProductById(id) {
  try {
    const { rows: [product] } = await client.query(`
    SELECT * FROM products
    WHERE id = $1
    `, [id])

    return product;
  } catch (err) {
    console.log('getProductById-products.js FAILED', err)
  }
}


async function getProductByName(name) {
  try {
    const { rows: [product] } = await client.query(`
      SELECT * FROM products
      WHERE name = $1
    `, [name])

    return product;
  } catch (err) {
    console.log('getProductByName-products.js FAILED', err)
  }
}

async function getProductByCategory(category) {
  try {
    const { rows: product } = await client.query(`
    SELECT * FROM products
    WHERE category = $1
    `, [category])

    return product;
  } catch (err) {
    console.log('getProductByCategory-products.js FAILED', err)
  }
}

async function createProduct({
  title,
  description,
  category,
  price,
  image
}) {
  try {
    const { rows: [product] } = await client.query(`
      INSERT INTO products (title, description, category, price, image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [title, description, category, price, image])

    return product;
  }
  catch (err) {
    console.log('createProduct-products.js FAILED', err)
  }
}

async function updateProduct(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    if (setString.length > 0) {
      await client.query(`
      UPDATE products
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
      `, Object.values(fields))
    }

    return await getProductById(id);
  } catch (err) {
    console.log('updateProduct-products.js FAILED', err)
  }
}

async function addCategoryToProduct(productId, categoryId) {
  try {
    const { rows: [productCategory] } = await client.query(`
    INSERT INTO product_categories(productId, categoryId)
    VALUES ($1, $2)
    RETURNING *;
    `, [productId, categoryId])

    return productCategory;
  } catch (err) {
    console.log('addCategoryToProduct-products.js FAILED', err)
  }
}

async function deleteProduct(id) {
  try {
    const { rows: product } = await client.query(`
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
    `, [id])

    return product;
  } catch (err) {
    console.log('deleteProduct-products.js FAILED', err)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct
}
