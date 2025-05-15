const express = require('express');
//updated two years ago
// const { createGuestCart } = require('../db/cart');
const { requireUser } = require("./utils");
const cartRouter = express.Router();
const {
  addItemToCart,
  getMyCartWithItems,
  deleteItemFromCart,
  createUserCart,
  // createGuestCart,
  checkOut
} = require("../db/cart");


cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");
  next();
});

// Gets a user's cart
cartRouter.get("/myCart", requireUser, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const myCart = await getMyCartWithItems(userId);
    if (myCart.length !== 0){
      res.send(myCart)
    } else {
      res.send("There is no cart")
    }
  } catch (error) {
    next(error);
  }
});


// cartRouter.get('/guestCart', (req, res, next) => {
//   const {guestCart} = req.session;
//   if (!guestCart) {
//     res.send ("No items to display")
//   } else {
//     res.send(req.session.guestCart)
//   }
// })


// cartRouter.post('/guestCart', (req, res, next) => {
//   const { productId, product_name, priceAtPurchase } = req.body;

//   const guestItem = { productId, product_name, priceAtPurchase}
//   const { guestCart } = req.session
//   if ( guestCart ) {
//     const { items } = guestCart;
//     items.push(guestItem)
//   } else {
//     req.session.guestCart = {
//       items: [guestItem]
//     }
//   }
//   res.send(req.session.guestCart)
// })

// //deletes item from session storage
// cartRouter.delete('/guestCart', (req, res, next) => {
//   try { 
//     const { idx } = req.body;
//     const { guestCart } = req.session
//     const { items } = guestCart
//     items.splice(idx, 1)
//     res.send(guestCart)
//   } catch (error) {
//     next(error)
//   }
// })

// //create guest cart checkout
// cartRouter.post('/guestCart/checkout', async (req, res, next) => {
//   try {
//     const guestCart = await createGuestCart({
//       session_id: req.sessionID,
//       order_status: "pending",
//     });
//     res.status(200).send(guestCart)
//     req.session.destroy(() => {
//       console.log("Session has been destroyed.")
//     });
//   } catch (error) {
//     next(error)
//   }
// })


// Create a user's cart
cartRouter.post("/newUserCart", async (req, res, next) => {
  const { userId, order_status } = req.body
  try {
    const newCart = await createUserCart({
      userId: userId,
      order_status: "active",
    });
    res.send(newCart);
  } catch (error) {
    next(error);
  }
});


// // Create a guest cart
// cartRouter.post("/newGuestCart", async (req, res, next) => {
//   const { sessionID } = req;
//   try {
//     const guestCart = await createGuestCart({
//       session_id: sessionID,
//       order_status: "active",
//     });
//     res.send(guestCart);
//   } catch (error) {
//     next(error);
//   }
// });


// Adds item to a cart
cartRouter.post("/", async (req, res, next) => {
  // const userId = req.user.id;
  const { productId, priceAtPurchase, cart_id } = req.body;
  try {
    const newItem = await addItemToCart({
      productId,
      priceAtPurchase,
      cart_id,
    });
    res.send(newItem);
  } catch (error) {
    next(error);
  }
});


// Deletes item from a cart
cartRouter.delete("/", async (req, res, next) => {
  const { cartedItemId } = req.body;
  try {
    const deletedItem = await deleteItemFromCart(cartedItemId);
    res.send(deletedItem);
  } catch (error) {
    next(error);
  }
});


// Changes a cart_order order_status to pending (patch)
cartRouter.patch('/checkout', async (req, res, next) => {
  const { cart_id } = req.body
  try {
    const checkedOutCart = await checkOut(cart_id);
    res.send(checkedOutCart)const express = require("express");
const { requireUser } = require("./utils");
const cartRouter = express.Router();

const {
  addItemToCart,
  getMyCartWithItems,
  deleteItemFromCart,
  createUserCart,
  checkOut,
} = require("../db/cart");

// Middleware logger
cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");
  next();
});

// Get a user's cart
cartRouter.get("/myCart", requireUser, async (req, res, next) => {
  try {
    const myCart = await getMyCartWithItems(req.user.id);
    if (!myCart || myCart.length === 0) {
      return res.status(404).json({ message: "There is no cart" });
    }
    res.status(200).json(myCart);
  } catch (error) {
    next(error);
  }
});

// Create a new cart for a user
cartRouter.post("/newUserCart", async (req, res, next) => {
  const { userId, order_status = "active" } = req.body;
  try {
    const newCart = await createUserCart({ userId, order_status });
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// Add item to a cart
cartRouter.post("/", requireUser, async (req, res, next) => {
  const { productId, priceAtPurchase, cart_id } = req.body;

  if (!productId || !cart_id || typeof priceAtPurchase !== "number") {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const newItem = await addItemToCart({
      productId,
      priceAtPurchase,
      cart_id,
    });
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// Delete item from a cart
cartRouter.delete("/", async (req, res, next) => {
  const { cartedItemId } = req.body;

  if (!cartedItemId) {
    return res.status(400).json({ error: "cartedItemId is required" });
  }

  try {
    const deletedItem = await deleteItemFromCart(cartedItemId);
    res.status(200).json(deletedItem);
  } catch (error) {
    next(error);
  }
});

// Checkout cart
cartRouter.patch("/checkout", async (req, res, next) => {
  const { cart_id } = req.body;

  if (!cart_id) {
    return res.status(400).json({ error: "cart_id is required" });
  }

  try {
    const checkedOutCart = await checkOut(cart_id);
    res.status(200).json(checkedOutCart);
  } catch (error) {
    next(error);
  }
});

module.exports = cartRouter;

  } catch (error) {
    next(error)
  }
})

module.exports = cartRouter;