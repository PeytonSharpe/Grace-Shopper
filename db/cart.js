const productsRouter = require('../api/productsRouter');
const client = require('./client');
const { createUser } = require('./users');

async function createCartOrdersTable() {
  try {
    console.log("Creating cart orders table");
    await client.query(`
      CREATE TABLE cart_orders (
        id SERIAL PRIMARY KEY,
        userId INTEGER REFERENCES users(id),
        order_status VARCHAR(255) DEFAULT 'active' CHECK(order_status IN ('active', 'pending', 'shipped', 'canceled', 'lost at sea')),
        session_id TEXT
      );
    `);
    console.log("Finished creating cart_orders table");
  } catch (error) {
    console.log("Error in creating cart_orders table", error);
    throw error;
  }
}

async function createCartItemsTable() {
  try {
    console.log("Creating cart items table...");
    await client.query(`
      CREATE TABLE carted_items (
        id SERIAL PRIMARY KEY,
        productId INTEGER REFERENCES products(id),
        "priceAtPurchase" FLOAT DEFAULT 0.00,
        cart_id INTEGER REFERENCES cart_orders(id)
      );
    `);
    console.log("Finished creating cart table");
  } catch (error) {
    console.log("Error creating cart table", error);
    throw error;
  }
}

async function createUserCart({ userId, order_status }) {
  try {
    const { rows: [cart] } = await client.query(`
      INSERT INTO cart_orders(userId, order_status)
      VALUES ($1, $2)
      RETURNING *;
    `, [userId, order_status]);
    return cart;
  } catch (error) {
    console.log("Error creating user cart", error);
    throw error;
  }
}

async function createGuestCart({ session_id, order_status }) {
  try {
    const { rows: [cart] } = await client.query(`
      INSERT INTO cart_orders(session_id, order_status)
      VALUES ($1, $2)
      RETURNING *;
    `, [session_id, order_status]);
    return cart;
  } catch (error) {
    console.log("Error creating a guest cart", error);
    throw error;
  }
}

async function addItemToCart({ productId, priceAtPurchase, cart_id }) {
  try {
    const { rows: [item] } = await client.query(`
      INSERT INTO carted_items(productId, "priceAtPurchase", cart_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [productId, priceAtPurchase, cart_id]);
    return item;
  } catch (error) {
    console.log("Error adding item to the cart", error);
    throw error;
  }
}

async function createInitialCarts() {
  console.log("Starting to create initial carts...");
  try {
    const cartsToCreate = [
      { userId: 1, order_status: 'active' },
      { userId: 2, order_status: 'pending' },
      { userId: 3, order_status: 'active' },
      { userId: 2, order_status: 'active' },
      { userId: 4, order_status: 'active' }
    ];
    const cart = await Promise.all(cartsToCreate.map(createUserCart));
    console.log("Carts created: ", cart);
    console.log("Finished creating initial cart");
  } catch (error) {
    console.log("Error creating initial cart!", error);
    throw error;
  }
}

async function createInitialCartItems() {
  console.log("Start to add cart items");
  try {
    const itemsToAdd = [
      { productId: 1, priceAtPurchase: 13.99, cart_id: 1 },
      { productId: 1, priceAtPurchase: 13.99, cart_id: 1 },
      { productId: 3, priceAtPurchase: 99.99, cart_id: 1 },
      { productId: 5, priceAtPurchase: 9.99, cart_id: 2 },
      { productId: 9, priceAtPurchase: 43.99, cart_id: 2 },
      { productId: 7, priceAtPurchase: 81.99, cart_id: 2 },
      { productId: 9, priceAtPurchase: 99.90, cart_id: 3 },
      { productId: 4, priceAtPurchase: 99.90, cart_id: 3 },
      { productId: 15, priceAtPurchase: 99.90, cart_id: 4 }
    ];
    const cartItems = await Promise.all(itemsToAdd.map(addItemToCart));
    console.log("Items added to carts: ", cartItems);
    console.log("Finished adding items to cart");
  } catch (error) {
    console.log("error in createInitialCartItems", error);
    throw error;
  }
}

async function getMyCartWithItems(userId) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT * 
      FROM cart_orders
      WHERE order_status='active' AND userId=$1;
    `, [userId]);

    const { rows: items } = await client.query(`
      SELECT carted_items.*, products.name AS product_name, products.img_url AS product_img
      FROM carted_items
      JOIN products ON products.id = carted_items.productId;
    `);

    if (items.length === 0) {
      cart.items = [];
      return cart;
    } else {
      const itemsToAdd = items.filter(item => item.cart_id === cart.id);
      cart.items = itemsToAdd;
      return cart;
    }
  } catch (error) {
    console.log("Error getting cart with items", error);
    throw error;
  }
}

async function getMyPreviousOrdersWithItems(userId) {
  try {
    const { rows: carts } = await client.query(`
      SELECT * 
      FROM cart_orders
      WHERE cart_orders.userId=$1 AND cart_orders.order_status != 'active';
    `, [userId]);

    const { rows: items } = await client.query(`
      SELECT carted_items.*, products.name AS product_name
      FROM carted_items
      JOIN products ON products.id = carted_items.productId;
    `);

    for (const cart of carts) {
      const itemsToAdd = items.filter(item => item.cart_id === cart.id);
      cart.items = itemsToAdd;
    }

    return carts;
  } catch (error) {
    console.log("Error getting previous orders with items", error);
    throw error;
  }
}

async function deleteItemFromCart(cartedItemId) {
  try {
    const { rows: [item] } = await client.query(`
      DELETE FROM carted_items
      WHERE id=$1
      RETURNING *;
    `, [cartedItemId]);
    console.log("Item that was deleted: ", item);
    return item;
  } catch (error) {
    console.log("Error deleting Item from Carted_Items", error);
    throw error;
  }
}

async function getCartBySessionID(sessionID) {
  try {
    const { rows: [cart] } = await client.query(`
      SELECT * FROM cart_orders
      WHERE session_id=$1;
    `, [sessionID]);
    return cart;
  } catch (error) {
    console.log("Error getting cart by sessionID", error);
    throw error;
  }
}

async function checkOut(id) {
  try {
    const { rows: [cart] } = await client.query(`
      UPDATE cart_orders
      SET order_status='pending'
      WHERE id=$1
      RETURNING *;
    `, [id]);
    return cart;
  } catch (error) {
    console.log("Error in checkOut function in db/models/cart", error);
    throw error;
  }
}

async function updateCartStatus(id, status) {
  try {
    const { rows: [cart] } = await client.query(`
      UPDATE cart_orders
      SET "order_status"= $1
      WHERE id=$2
      RETURNING *;
    `, [status, id]);
    return cart;
  } catch (error) {
    console.log("Error updating cart status", error);
    throw error;
  }
}

module.exports = {
  createCartOrdersTable,
  createCartItemsTable,
  addItemToCart,
  createInitialCarts,
  createInitialCartItems,
  getMyCartWithItems,
  getMyPreviousOrdersWithItems,
  deleteItemFromCart,
  createGuestCart,
  createUserCart,
  checkOut,
  getCartBySessionID,
  updateCartStatus
};
// Note: The functions createCartOrdersTable and createCartItemsTable are not called in this file.
// They should be called in a separate migration file or setup script to create the tables in the database.