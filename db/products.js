const { client } = require('./client');

async function getAllProducts() {
 
  try {
    const { rows } = await client.query(`
    SELECT * FROM products;

    `)
   
    
console.log(rows)
    return rows;
  } catch (err) {
    console.log('getAllProducts-products.js FAILED', err)
    throw err
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
    throw err
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
    throw err
  }
}



async function createProduct({
  title,
  description,
  price,
  count,
  image
}) {
  try {
    const { rows: [product] } = await client.query(`
    INSERT INTO products (title, description, price, count, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `, [title, description, price, count, image])

    return product;
  }
  catch (err) {
    console.log('createProduct-products.js FAILED', err)
    throw err
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
    throw err
  }
}

async function getProductByCategory(categoryName) {
  console.log(categoryName)
  try {
    const {
      rows: products,
    } = await client.query(`
    SELECT products.*
    FROM categories
    JOIN prod_categories ON categories.id=prod_categories."categoryId"
    JOIN products ON products.id=prod_categories."productId"
    WHERE categories.name=$1;
    `, [categoryName]
    );

    return products;
  } catch (err) {
    console.log('getProductByCategory-products.js FAILED', err);
    throw err
  }
}

async function getAllProdCategories() {
  try {
    const { rows: result } = await client.query(`
    SELECT *
    FROM prod_categories;
    `)

    return result;
  } catch (err) {
    console.log('Error')
    throw err
  }
}

async function addCategoryToProduct({ productId, categoryId }) {
  try {
    const { rows: [productCategory] } = await client.query(`
    INSERT INTO prod_categories("productId", "categoryId")
    VALUES ($1, $2)
    RETURNING *;
    `, [productId, categoryId])

    return productCategory
  } catch (err) {
    console.log('addCategoryToProduct-product.js FAILED', err)
    throw err
  }
}

async function deleteProduct(id) {
  try {
    const { rows: prod_categories} = await client.query(`
    DELETE FROM prod_categories
    WHERE "productId" = $1
    RETURNING *;`,[id])
    const { rows: product } = await client.query(`
    DELETE FROM products 
    WHERE id = $1
    RETURNING *;
    `, [id])

    return product;
  } catch (err) {
    console.log('deleteProduct-products.js FAILED', err)
    throw err
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  getAllProdCategories,
  addCategoryToProduct,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct
}