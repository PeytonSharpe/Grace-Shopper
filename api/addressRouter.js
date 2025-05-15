const express = require("express");
const {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressByUserId,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// POST /api/address/guestaddress
router.post("/guestaddress", async (req, res, next) => {
  const { address } = req.body;
  console.log(address);
  try {
    const newAddress = await createAddress(address);
    res.json(newAddress);
  } catch (error) {
    next(error);
  }
});

// POST /api/address/createaddress
router.post("/createaddress", requireUser, async (req, res, next) => {
  const { userId, label, street1, street2, city, state, zipcode } = req.body;

  if (req.user.id !== Number(userId)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const address = await createAddress({
      userId,
      label,
      street1,
      street2,
      city,
      state,
      zipcode,
    });

    res.json(address);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/address/:addressId/:userId
router.patch("/:addressId/:userId", requireUser, async (req, res, next) => {
  const id = req.params.addressId;
  const userId = req.params.userId;
  const { label, street1, street2, city, state, zipcode } = req.body;

  if (req.user.id !== Number(userId)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const updatedAddress = await updateAddress({
      id,
      userId,
      label,
      street1,
      street2,
      city,
      state,
      zipcode,
    });

    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
});

// GET /api/address/:userId
router.get("/:userId", requireUser, async (req, res, next) => {
  const userId = req.params.userId;

  if (req.user.id !== Number(userId)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const address = await getAddressByUserId(userId);
    res.json(address);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/address/:addressId/:userId
router.delete("/:addressId/:userId", requireUser, async (req, res, next) => {
  const id = req.params.addressId;
  const userId = req.params.userId;

  if (req.user.id !== Number(userId)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const deletedAddress = await deleteAddress(id, userId);
    res.json(deletedAddress);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
// const express = require('express');
// const {