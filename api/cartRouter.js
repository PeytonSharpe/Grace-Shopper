const express = require('express');

const { requireUser } = require("./utils");
const cartRouter = express.Router();
const {
  addItemToCart,
  getMyCartWithItems,
  deleteItemFromCart,
  createUserCart,
  createGuestCart,
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


cartRouter.get('/guestCart', (req, res, next) => {
  const {guestCart} = req.session;
  if (!guestCart) {
    res.send ("No items to display")
  } else {
    res.send(req.session.guestCart)
  }
})


cartRouter.post('/guestCart', (req, res, next) => {
  const { productId, product_name, priceAtPurchase } = req.body;

  const guestItem = { productId, product_name, priceAtPurchase}
  const { guestCart } = req.session
  if ( guestCart ) {
    const { items } = guestCart;
    items.push(guestItem)
  } else {
    req.session.guestCart = {
      items: [guestItem]
    }
  }
  res.send(req.session.guestCart)
})

//deletes item from session storage
cartRouter.delete('/guestCart', (req, res, next) => {
  try { 
    const { idx } = req.body;
    const { guestCart } = req.session
    const { items } = guestCart
    items.splice(idx, 1)
    res.send(guestCart)
  } catch (error) {
    next(error)
  }
})

//create guest cart checkout
cartRouter.post('/guestCart/checkout', async (req, res, next) => {
  try {
    const guestCart = await createGuestCart({
      session_id: req.sessionID,
      order_status: "pending",
    });
    res.status(200).send(guestCart)
    req.session.destroy(() => {
      console.log("Session has been destroyed.")
    });
  } catch (error) {
    next(error)
  }
})


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


// Create a guest cart
cartRouter.post("/newGuestCart", async (req, res, next) => {
  const { sessionID } = req;
  try {
    const guestCart = await createGuestCart({
      session_id: sessionID,
      order_status: "active",
    });
    res.send(guestCart);
  } catch (error) {
    next(error);
  }
});


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
    res.send(checkedOutCart)
  } catch (error) {
    next(error)
  }
})

module.exports = cartRouter;