const client = require("./client.js");
// const {  } = require("./");

//returns cart object, created with supplied user
async function createCart({ id }) {
    try {
        if (id) {
            const { rows: [cart] } = await client.query
                (`
                INSERT INTO cart("user_id")
                VALUES($1)
                RETURNING *;
                `, [id] );
                
                return cart;
        }
    } catch(error) {
        throw('Nope, no Cart for you, my bad G');
    }
}

//sets the cart to purchased -- parameter is a cart object, returns cart object
async function convertCartToPurchased({ id }) {
    try {
      let {
        rows: [cart],
      } = await client.query
              (`UPDATE carts
              SET purchased = true
              WHERE id = $1
              RETURNING *;`, [id]);

      cart = await attachItemsToCarts([cart]);
      for (const item in cart.items) {
        await reduceInventory(item.id, item.quantity);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }


//deletes non-purchased carts -- parameter is a user object, returns nothing
async function deleteActiveCart({ id }) {
    try {
      if (id) {
        //need to get cart to delete, delete its items, then delete the cart
        const rows = await client.query(
          `SELECT * FROM carts
                   WHERE user_id = $1
                   AND
                   purchased = false;                 
                   `,
          [id]
        );
        const cartId = rows[0]?.id;
        await client.query(
          `DELETE FROM cart_items
                   WHERE cart_id = $1;
                   DELETE FROM carts
                   WHERE id = $1;`,
          [cartId]
        );
      }
    } catch (error) {
      throw error;
    }
  }
  
//gets all carts -- parameter is a user object, returns an array of carts with cart_items attached
async function getPurchasedCartsByUser({ id }) {
    try {
      const { rows: carts } = await client.query(
        `SELECT * FROM carts
              WHERE carts.user_id = $1
              AND purchased = true;
              `,
        [id]
      );
      const cartsWithItems = await attachItemsToCarts(carts);
      const CartsWithOrders = await attachOrdertoCart(cartsWithItems);
      return CartsWithOrders;
    } catch (error) {
      throw error;
    }
  }
  




// async function createInitialCarts() {
//     console.log("Starting to create carts...");
//     try {
//       const user1 = await getUserById(1);
//       console.log("fetched user 1: ", user1);
//       const user2 = await getUserById(2);
//       const user3 = await getUserById(3);
//       const myUsers = [user1, user2, user3];
//       const carts = await Promise.all(myUsers.map(createCart));
  
//       console.log("Carts created:");
//       console.log(carts);
//       console.log("Finished creating carts!");
//     } catch (error) {
//       console.error("Error creating carts!");
//       throw error;
//     }
//   }


