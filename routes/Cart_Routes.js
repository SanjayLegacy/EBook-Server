const express = require("express");
const router = express.Router();
const { validateUserToken } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

router.get("/getAllCartItems", validateUserToken, cartController.getCart);

router.post("/addToCart", validateUserToken, cartController.addToCart);

router.post("/createCart", cartController.createCart);

router.delete(
  "/removeCartItem/:id",
  validateUserToken,
  cartController.removeItemFromCart
);

router.put(
  "/updateCartItem/:id",
  validateUserToken,
  cartController.updateCartItem
);

router.delete("/clearCart", validateUserToken, cartController.clearCart);

module.exports = router;
