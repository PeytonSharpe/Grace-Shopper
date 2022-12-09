const productsRouter = require('../api/productsRouter');

const { client } = require('./client');

const { createUser } = require('./users');

async function createCartOrdersTable(){
  try {
    console.log("Creating cart orders table")

    await client.query(`
      CREATE TABLE cart_orders
      (
        id SERIAL PRIMARY KEY,

        userId INTEGER REFERENCES users(id),

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
        "productId" INTEGER REFERENCES products(id),
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


// on api/frontend: check if logged in user has an active cart (getActiveCartByUserId) in a useEffect
// if it doesnt exist (falsy), create a new active cart with userId (if logged in) or sessionID (if guest) in a useEffect
async function createUserCart({ userId, order_status }){
  try {
    const { rows: [ cart ] } = await client.query(`
      INSERT INTO cart_orders(userId, order_status)
      VALUES ($1, $2)
      RETURNING *;
    `, [ userId, order_status ])


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


async function addItemToCart({ productId, userId }){
  // produc and priceAtPurchase can be taken from the frontend
  // cart_id can be stored in a useState, and a useEffect can be used to fetch cart
  try {
    const { rows: [ item ]} = await client.query(`
      INSERT INTO cart("productId", "userId")
      VALUES ($1, $2)
      RETURNING *;
    `, [ productId, userId ])

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
      { userId: 1, order_status: 'active' }, // cart 1
      { userId: 2, order_status: 'pending'}, // cart 2
      { userId: 3, order_status: 'active' }, // cart 3
      { userId: 2, order_status: 'active' }, // cart 4
      { userId: 4, order_status: 'active' } // cart 5
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
        productId: 1,
        priceAtPurchase: 13.99,
        cart_id: 1
      },
      {

        productId: 1,

        priceAtPurchase: 13.99,
        cart_id: 1
      },
      {

        productId: 3,

        priceAtPurchase: 99.99,
        cart_id: 1
      },
      {

        productId: 5,

        priceAtPurchase: 9.99,
        cart_id: 2
      },
      {

        productId: 9,

        priceAtPurchase: 43.99,
        cart_id: 2
      },
      {

        productId: 7,

        priceAtPurchase: 81.99,
        cart_id: 2
      },
      {

        productId: 9,

        priceAtPurchase: 99.90,
        cart_id: 3
      },
      {

        productId: 4,

        priceAtPurchase: 99.90,
        cart_id: 3
      },
      {

        productId: 15,

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

  // and join it with individual_cart_items at produc=products(id)
}
//ACTIVE CART WITH ITEMS
async function getMyCartWithItems(userId){

  // requires user authentication
  try {
    const { rows: [cart] } = await client.query(`
      SELECT * 
      FROM cart
      JOIN products ON products.id = cart."productId"
      WHERE cart."userId" = $1;
    `, [userId])



    // const { rows: items } = await client.query(`
    //   SELECT carted_items.*, products.name AS product_name, products.img_url AS product_img
    //   FROM carted_items

    //   JOIN products ON products.id = carted_items."productId";

    // `)
    
    // if (items.length === 0){
    //   cart.items = []
    // } else {
    //   const itemsToAdd = items.filter(item => item.cart_id === cart.id)
    //   cart.items = itemsToAdd
    //   return cart

    // }
  
    return cart

  } catch (error) {
    console.log("Error getting cart with items");
    throw error;
  }
}
//ALL OF MY ORDERS WITH ITEMS
async function getMyPreviousOrdersWithItems(userId){
  // for viewing previous orders
  // gets all cart_orders and carted_items with that cart_order
  // regardless of order_status
  try {
    const { rows: carts } = await client.query(`
      SELECT * 
      FROM cart_orders
      WHERE cart_orders.userId=$1 AND cart_orders.order_status != 'active';
    `, [userId])

    const { rows: items } = await client.query(`
      SELECT carted_items.*, products.name AS product_name
      FROM carted_items
      JOIN products ON products.id = carted_items."productId";
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


// Admin functions
// gets all cart_orders with carted_items
// update cartOrders
// getCartOrdersWithItemsByUserId - on admin dashboard, if looking at user, admin can pull up cart_orders for a user



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
};








// //returns cart object, created with supplied user
// async function createCart({ id }) {
//   try {
//     if (id) {
//       const { rows: [cart] } = await client.query
//         (`
//           INSERT INTO cart("userId")
//           VALUES($1)
//           RETURNING *;
//           `, [id]);
//       return cart
//     };
//   } catch (error) {
//     throw ('Nope, no Cart for you, my bad G. find me in cart.js');
//   }
// }



// //deletes non-purchased carts -- parameter is a user object, returns nothing
// async function deleteActiveCart({ id }) {
//   try {
//     if (id) {
//       //need to get cart to delete, delete its items, then delete the cart
//       const rows = await client.query(
//         `SELECT * FROM cart
//          WHERE "userId" = $1                                    
//         `, [id]);

//       const cartId = rows[0]?.id;
//       await client.query(
//         `DELETE FROM cart_items
//                    WHERE cart_id = $1;
//                    DELETE FROM cart
//                    WHERE id = $1;`,
//         [cartId]
//       );
//     }
//   } catch (error) {
//     throw error;
//   }
// }
              
// //attaches the order to the cart
// async function attachOrdertoCart(carts) {
//   const cartsToReturn = [...carts];
//   const binds = carts.map((_, index) => `$${index + 1}`).join(", ");
//     if (!cartsIds?.length) return [];
//       try {
//         const { rows: orders } = await client.query
//           (`
//             SELECT orders.*
//             FROM cart 
//             JOIN orders ON orders.cart_id = cart.id
//             WHERE orders.cart_id IN (${binds})
//           `, cartsIds);
        
//         for (const cart of cartsToReturn) {
//           const ordersToAdd = orders.filter((order) => order.cart_id === cart.id);
          
//           cart.order = ordersToAdd;
//         }
//         return cartsToReturn;
//       } catch (error) {
//         console.error(error);
//       }
// }


// //gets active cart, takes in user object and returns cart object
// async function getActiveCart({ id }) {
//   try {
//     console.log("starting to get the cart");
//     const { rows: [cart] } = await client.query
//     (`SELECT * FROM cart
//     JOIN products ON products.id = "productId"
//     WHERE cart."userId" = $1       
//     `, [id]);
//     // 'join' attaches the prod to the cart row, in frontend will be able to map thru and disp all rows
//     return cart
    
//     // if (cart) return attachItemsToCarts([cart]);
//     // const newCart = createCart({ id });
//     // return attachItemsToCarts([newCart]);
//   } catch (error) {
//     throw error;
//   }
// }



//comments above here viable prior to 12/1


//gets all the carts; parameter is a user object, returns an array of carts with cart_items attached
// async function getPurchasedCartsByUser({ id }) {
  //     try {
    //       const { rows: carts } = await client.query
    //             (`SELECT * FROM cart
    //               WHERE cart."userId" = $1
    //               AND purchases = true;
    //               `, [id]);
    //       const cartsWithItems = await attachItemsToCarts(carts);
    //       const CartsWithOrders = await attachOrdertoCart(cartsWithItems);
    //         return CartsWithOrders;
    //       } catch (error) {
      //         throw error;
      //       }
  //   }
  
//sets the cart to purchased; arameter is a cart object, returns cart object
// async function convertCartToPurchased({ id }) {
//     try {
//       let {
//         rows: [cart],
//       } = await client.query
//               (`UPDATE cart
//               SET purchases = true
//               WHERE id = $1
//               RETURNING *;`, [id]);

//       cart = await attachItemsToCarts([cart]);
//       for (const item in cart.items) {
//         await reduceInventory(item.id, item.quantity);
//       }
//       return cart;
//     } catch (error) {
//       throw error;
//     }
//   }


  // async function getAllPurchasedCarts() {
    //   try {
      //     const { rows } = await client.query
      //     (`SELECT * FROM cart
      //       WHERE purchases = true;
      //       `);
      //     const cartsWithItems = await attachItemsToCarts(rows);
      //     const CartsWithOrders = await attachOrdertoCart(cartsWithItems);
//     return CartsWithOrders;
//   } catch (error) {
  //     throw error;
  //   }
  // }
  
  
  // async function deleteAbandonedGuestCarts() {
    //   try {
      //     await client.query //getting realtion "cart_items" does not exist
//         (`DELETE FROM cart_items WHERE id IN 
//         (SELECT cart_items.id as ccid 
//         FROM cart_items JOIN cart ON cart.id = cart_items.cart_id
//         WHERE purchases = FALSE AND "userId" = 9999);
//         DELETE FROM cart WHERE
//         purchases = FALSE AND
//         "userId" = 9999;
//       `)
//   } catch (error) {
//     throw error;
//   }
// }


// module.exports = {
//   createCart,
//   deleteActiveCart,
//   getActiveCart,
//   // getPurchasedCartsByUser,
//   // convertCartToPurchased,  
//   // getAllPurchasedCarts,
//   // // getActiveCartId,
//   // deleteAbandonedGuestCarts
// };

