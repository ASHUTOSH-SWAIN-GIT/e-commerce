const express = require("express");
const { addToCart, removeFromCart, getCart, checkoutCart } = require("../controllers/cartController");
const { protect, isBuyer } = require("../middleware/authMiddleware"); // Ensure only buyers access

const router = express.Router();

router.get("/", protect, isBuyer, getCart); // View Cart
router.post("/add", protect, isBuyer, addToCart); // Add Product
router.delete("/remove/:productId", protect, isBuyer, removeFromCart); // Remove Product
router.post("/checkout", protect, isBuyer, checkoutCart); // Checkout

module.exports = router;
