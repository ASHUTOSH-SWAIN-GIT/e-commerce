const Cart = require("../models/cart");
const product = require("../models/product")
const User = require("../models/users")
const mongoose = require("mongoose");
const Coupon = require("../models/coupon");

// @desc    Get buyer's cart
// @route   GET /api/cart/
// @access  Private (Buyer Only)
const getCart = async (req, res) => {
    try {
        // Ensure req.user._id exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const cart = await Cart.findOne({ buyer: req.user._id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.json({ message: "Your cart is empty" });
        }

        res.json(cart);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private (Buyer Only)

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Ensure req.user._id exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        let cart = await Cart.findOne({ buyer: req.user._id });

        // If no cart exists, create a new one and save it
        if (!cart) {
            cart = new Cart({ buyer: req.user._id, products: [] });
            await cart.save(); // Save the new cart to the database
        }

        // Use cart.products instead of cart.items
        const existingProduct = cart.products.find(item => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save(); // Save the updated cart
        res.json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: error.message });
    }
};
// @desc    Remove product from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private (Buyer Only)
const removeFromCart = async (req, res) => {
    try {
        // Ensure req.user._id exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        // Validate productId from params
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const cart = await Cart.findOne({ buyer: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Use cart.products instead of cart.items
        const initialLength = cart.products.length;
        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        // Check if anything was removed
        if (initialLength === cart.products.length) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await cart.save();
        res.json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: error.message });
    }
};

// @desc    Checkout cart (clear cart after purchase)
// @route   POST /api/cart/checkout
// @access  Private (Buyer Only)

const checkoutCart = async (req, res) => {
    try {
        const { username, couponCode } = req.body; // Get username & optional coupon code

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Find the user by username
        const foundUser = await User.findOne({ username }); // Capitalized User
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is a buyer
        if (foundUser.role !== "buyer") {
            return res.status(403).json({ message: "Only buyers can checkout" });
        }

        // Fetch the cart for the buyer
        const cart = await Cart.findOne({ buyer: foundUser._id }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Calculate total price with safety check
        let totalPrice = cart.products.reduce((acc, item) => {
            const price = item.product && typeof item.product.price === 'number' ? item.product.price : 0;
            return acc + (price * item.quantity);
        }, 0);

        console.log(`Original Total Price: ${totalPrice}`);

        // Initialize discount amount
        let discountAmount = 0;

        // Apply discount if a valid coupon code is provided
        if (couponCode) {
            // Fetch the coupon from the database
            const existingCoupon = await Coupon.findOne({ code: couponCode }); // Capitalized Coupon
            if (!existingCoupon) {
                return res.status(400).json({ message: "Invalid coupon code" });
            }

            if (existingCoupon.expirationDate < new Date()) {
                return res.status(400).json({ message: "Coupon has expired" });
            }

            discountAmount = existingCoupon.discount || 0; // Default to 0 if discount is undefined
            totalPrice -= discountAmount;

            // Ensure total price doesn't go negative
            if (totalPrice < 0) totalPrice = 0;

            console.log(`Discount Applied: ${discountAmount}, New Total Price: ${totalPrice}`);
        }

        // Validate totalPrice is a number
        if (isNaN(totalPrice) || totalPrice < 0) {
            return res.status(500).json({ message: "Invalid total price calculation" });
        }

        // Check if the user has enough balance
        if (foundUser.balance < totalPrice) {
            return res.status(400).json({
                message: "Insufficient balance. Please add funds to your account.",
                balance: foundUser.balance,
                totalPrice
            });
        }

        // Deduct total price from user balance
        foundUser.balance -= totalPrice;

        // Validate balance is still a number after deduction
        if (isNaN(foundUser.balance)) {
            return res.status(500).json({ message: "Error updating balance" });
        }

        await foundUser.save();

        // Empty the cart after successful checkout
        await Cart.findOneAndUpdate({ buyer: foundUser._id }, { products: [] });

        res.json({
            message: "Checkout successful!",
            discountApplied: discountAmount,
            remainingBalance: foundUser.balance,
            totalSpent: totalPrice
        });
    } catch (error) {
        console.error("Error in checkout:", error);
        res.status(500).json({ message: error.message });
    }
};

  
module.exports = { getCart, addToCart, removeFromCart, checkoutCart };
