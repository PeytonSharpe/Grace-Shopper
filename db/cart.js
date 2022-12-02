const productsRouter = require('../api/productsRouter');
const client = require('../client');
const { createUser } = require('./users');

async function createCartOrdersTable(){
  try {
    console.log("Creating cart orders table")

    await client.query(`
      CREATE TABLE cart_orders
      (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_status VARCHAR(255) DEFAULT 'active' CHECK(order_status IN ('active', 'pending', 'shipped', 'canceled', 'lost at sea')),
        session_id TEXT
      );
    `)
    console.log("Finished creating cart_orders table")
  } catch (error) {
    console.log("Error in creating cart_orders table", error)
    throw error;
  }
}

async function createCartItemsTable(){
  try {
    console.log("Creating cart items table...")

    await client.query(`
      CREATE TABLE carted_items
      (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        "priceAtPurchase" FLOAT DEFAULT 0.00,
        cart_id INTEGER REFERENCES cart_orders(id)
      );
    `)

    console.log("Finished creating cart table")
  } catch (error) {
    console.log("Error creating cart table")
    throw error
  }
}

async function createUserCart({ user_id, order_status }){
  try {
    const { rows: [ cart ] } = await client.query(`
      INSERT INTO cart_orders(user_id, order_status)
      VALUES ($1, $2)
      RETURNING *;
    `, [ user_id, order_status ])

    return cart;
  } catch (error) {
    console.log("Error creating user cart")
    throw error;
  }
}

async function createGuestCart({ session_id, order_status }){
  try {
    const { rows: [ cart ]} = await client.query(`
      INSERT INTO cart_orders(session_id, order_status)
      VALUES ($1, $2)
      RETURNING *;
    `, [ session_id, order_status ])

    return cart;
  } catch (error) {
    console.log("Error creating a guest cart");
    throw error;
  }
}


async function addItemToCart({ product_id, priceAtPurchase, cart_id }){
  // product_id and priceAtPurchase can be taken from the frontend
  // cart_id can be stored in a useState, and a useEffect can be used to fetch cart
  try {
    const { rows: [ item ]} = await client.query(`
      INSERT INTO carted_items(product_id, "priceAtPurchase", cart_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [ product_id, priceAtPurchase, cart_id ])

    return item;
  } catch (error) {
    console.log("Error adding item to the cart")
    throw error;
  }
}

async function createInitialCarts(){
  console.log("Starting to create initial carts...")
  try {
    const cartsToCreate = [
      { user_id: 1, order_status: 'active' }, // cart 1
      { user_id: 2, order_status: 'pending'}, // cart 2
      { user_id: 3, order_status: 'active' }, // cart 3
      { user_id: 2, order_status: 'active' }, // cart 4
      { user_id: 4, order_status: 'active' } // cart 5
    ]
    const cart = await Promise.all(cartsToCreate.map(createUserCart));
    console.log("Carts created: ", cart)
    console.log("Finished creating initial cart")
  } catch (error) {
    console.log("Error creating initial cart!")
    throw error;
  }
}

async function createInitialCartItems(){
  console.log("Start to add cart items");
  try {
    const itemsToAdd = [
      {
        product_id: 1,
        priceAtPurchase: 13.99,
        cart_id: 1
      },
      {
        product_id: 1,
        priceAtPurchase: 13.99,
        cart_id: 1
      },
      {
        product_id: 3,
        priceAtPurchase: 99.99,
        cart_id: 1
      },
      {
        product_id: 5,
        priceAtPurchase: 9.99,
        cart_id: 2
      },
      {
        product_id: 9,
        priceAtPurchase: 43.99,
        cart_id: 2
      },
      {
        product_id: 7,
        priceAtPurchase: 81.99,
        cart_id: 2
      },
      {
        product_id: 9,
        priceAtPurchase: 99.90,
        cart_id: 3
      },
      {
        product_id: 4,
        priceAtPurchase: 99.90,
        cart_id: 3
      },
      {
        product_id: 15,
        priceAtPurchase: 99.90,
        cart_id: 4
      },
    ]
    const cartItems = await Promise.all(itemsToAdd.map(addItemToCart))
    console.log("Items added to carts: ", cartItems)
    console.log("Finished adding items to cart");
  } catch (error) {
    console.log("error in createInitialCartItems");
    throw error;
  }
}

async function joinProductsInfoWithCartItems() {
  // This function will be used to get relevant product info (name, img)
  // and join it with individual_cart_items at product_id=products(id)
}
//ACTIVE CART WITH ITEMS
async function getMyCartWithItems(user_id){
  // requires user authentication
  try {
    const { rows: [cart] } = await client.query(`
      SELECT * 
      FROM cart_orders
      WHERE order_status='active' AND user_id=$1;
    `, [user_id])


    const { rows: items } = await client.query(`
      SELECT carted_items.*, products.name AS product_name, products.img_url AS product_img
      FROM carted_items
      JOIN products ON products.id = carted_items.product_id;
    `)
    
    if (items.length === 0){
      cart.items = []
    } else {
      const itemsToAdd = items.filter(item => item.cart_id === cart.id)
      cart.items = itemsToAdd
      return cart
    }
  

  } catch (error) {
    console.log("Error getting cart with items");
    throw error;
  }
}
//ALL OF MY ORDERS WITH ITEMS
async function getMyPreviousOrdersWithItems(user_id){
  // for viewing previous orders
  // gets all cart_orders and carted_items with that cart_order
  // regardless of order_status
  try {
    const { rows: carts } = await client.query(`
      SELECT * 
      FROM cart_orders
      WHERE cart_orders.user_id=$1 AND cart_orders.order_status != 'active';
    `, [user_id])

    const { rows: items } = await client.query(`
      SELECT carted_items.*, products.name AS product_name
      FROM carted_items
      JOIN products ON products.id = carted_items.product_id;
    `)

    for(const cart of carts){
      const itemsToAdd = items.filter(item => item.cart_id === cart.id)

      cart.items = itemsToAdd;
    }

    return carts
  } catch (error) {
    console.log("Error getting cart with items");
    throw error;
  }
}

async function deleteItemFromCart(cartedItemId){
  
  try {
    const { rows: [ item ]} = await client.query(`
      DELETE FROM carted_items
      WHERE id=$1
      RETURNING *;
    `, [cartedItemId])
    console.log("Item that was deleted: ", item)
    return item;

  } catch (error) {
    console.log("Error deleting Item from Carted_Items")
    throw error;
  }
}

async function getCartBySessionID(sessionID){
  try {
    const { rows: [ cart ]} = await client.query(`
      SELECT * FROM cart_orders
      WHERE session_id=$1
      RETURNING *;
    `, [cart])

    return cart;
  } catch (error) {
    console.log("Error getting cart by sessionID")
  }
}

async function checkOut(id){
  try {
    const { rows: [ cart ] } = await client.query(`
      UPDATE cart_orders
      SET order_status='pending'
      WHERE id=$1
      RETURNING *
    `, [id])

    return cart;
  } catch (error) {
    console.log("Error in checkOut function in db/models/cart")
    throw error;
  }
}

async function updateCartStatus(id, status) {
  try {
    const { rows: [ cart ] } = await client.query(`
      UPDATE cart_orders
      SET "order_status"= $1
      WHERE id=${id}
      RETURNING *;
    `, [status]);

    return cart;
  } catch (error) {
    console.log("Error updating cart status")
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
}