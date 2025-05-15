const express = require("express");
const cartRouter = express.Router();
const { requireUser } = require("./utils");

const {
  addItemToCart,
  getMyCartWithItems,
  deleteItemFromCart,
  createUserCart,
  checkOut,
} = require("../db/cart");

// Logger middleware
cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");
  next();
});

// Middleware to restrict route access by role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: insufficient permissions.",
      });
    }
    next();
  };
}

// GET /cart/myCart - Get the authenticated user's cart
cartRouter.get("/myCart", requireUser, async (req, res, next) => {
  try {
    const myCart = await getMyCartWithItems(req.user.id);
    if (!myCart || myCart.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found in cart.",
      });
    }
    res.status(200).json({ success: true, cart: myCart });
  } catch (error) {
    next(error);
  }
});

// POST /cart/newUserCart - Create a new cart (admin only)
cartRouter.post("/newUserCart", requireUser, requireRole("admin"), async (req, res, next) => {
  const { userId, order_status = "active" } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const newCart = await createUserCart({ userId, order_status });
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    next(error);
  }
});

// POST /cart - Add item to a cart
cartRouter.post("/", requireUser, async (req, res, next) => {
  const { productId, priceAtPurchase, cart_id } = req.body;

  if (!productId || !cart_id || typeof priceAtPurchase !== "number") {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid fields",
    });
  }

  try {
    const newItem = await addItemToCart({ productId, priceAtPurchase, cart_id });
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    next(error);
  }
});

// DELETE /cart - Remove item from cart
cartRouter.delete("/", requireUser, async (req, res, next) => {
  const { cartedItemId } = req.body;

  if (!cartedItemId) {
    return res.status(400).json({
      success: false,
      error: "cartedItemId is required",
    });
  }

  try {
    const deletedItem = await deleteItemFromCart(cartedItemId);
    res.status(200).json({ success: true, deletedItem });
  } catch (error) {
    next(error);
  }
});

// PATCH /cart/checkout - Checkout the cart
cartRouter.patch("/checkout", requireUser, async (req, res, next) => {
  const { cart_id } = req.body;

  if (!cart_id) {
    return res.status(400).json({
      success: false,
      error: "cart_id is required",
    });
  }

  try {
    const checkedOutCart = await checkOut(cart_id);
    res.status(200).json({ success: true, cart: checkedOutCart });
  } catch (error) {
    next(error);
  }
});

// Global error handler for /cart routes
cartRouter.use((error, req, res, next) => {
  console.error("Cart Route Error:", error);
  res.status(500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
});

module.exports = cartRouter;
// This code defines a set of routes for managing a shopping cart in an e-commerce application.
// It includes routes for getting the user's cart, creating a new cart, adding items to the cart, removing items from the cart, and checking out.