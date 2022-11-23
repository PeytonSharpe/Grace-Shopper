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
  console.log(address)
  try {
    const newAddress = await createAddress(address);
    res.send(newAddress);
  } catch (error) {
    throw error;
  }
});
// POST /api/address/createaddress
router.post("/createaddress", requireUser, async (req, res, next) => {
  console.log(req.body)
  const { userId, label, street1, street2, city, state, zipcode } = req.body;
  console.log('everything else',userId,label,street1, street2, city, state, zipcode)

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

    res.send(address);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Patch /api/address/:addressId/updateaddress
router.patch("/:addressId/:userId", requireUser, async (req, res, next) => {
  const id = req.params.addressId;
  const user_id = req.params.userId;
  const { label, street1, street2, city, state, zip } = req.body;

  try {
    const updatedAddress = await updateAddress({
      id,
      user_id,
      label,
      street1,
      street2,
      city,
      state,
      zip,
    });

    res.send(updatedAddress);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Get /api/address/:userId

router.get("/:userId", requireUser, async (req, res, next) => {
  console.log('user.id Address')
  const userId = req.params.userId;
  try {
    const address = await getAddressByUserId(userId);
    res.send(address);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/address/:addressId/deleteaddress
router.delete("/:addressId/:userId", requireUser, async (req, res, next) => {
  const id = req.params.addressId;
  const userId = req.params.userId;
  try {
    const deletedAddress = await deleteAddress(id, userId);
    res.send(deletedAddress);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;