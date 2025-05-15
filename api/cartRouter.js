const express = require('express');

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
// const express = require("express");
// const { requireUser } = require("./utils");