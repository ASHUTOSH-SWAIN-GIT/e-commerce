const Cart = require("../models/cart");
const Product = require("../models/product")
const user = require("../models/users")

// @desc    Get buyer's cart
// @route   GET /api/cart/
// @access  Private (Buyer Only)
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ buyer: req.user._id }).populate("items.product");

        if (!cart) return res.json({ message: "Your cart is empty" });

        res.json(cart);
    } catch (error) {
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
        const cart = await Cart.findOne({ buyer: req.user._id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();

        res.json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Checkout cart (clear cart after purchase)
// @route   POST /api/cart/checkout
// @access  Private (Buyer Only)
const checkoutCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ buyer: req.user._id });

        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

        // Perform order processing logic (like payment, reducing stock, etc.)

        cart.items = []; // Clear cart after checkout
        await cart.save();

        res.json({ message: "Checkout successful! Your cart is now empty." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, checkoutCart };
