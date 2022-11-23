const express = require("express");
const { createCart, getActiveCart } = require("../db");
const cartRouter = express.Router();

cartRouter.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params
    const carts = await getActiveCart(cartId)
    res.send({
      carts
    });
  } catch (error) {
    throw error;
  }
});

cartRouter.post("/", async (req, res, next) => {
  const { user_id, purchased } = req.body;
  try {
    const newCart = await createCart({
      user_id, purchased
    });
    res.send({ message: "New Cart Created!", newCart: newCart });
  } catch (error) {
    next({ message: "CART ERROR" });
  }
});

module.exports = cartRouter;