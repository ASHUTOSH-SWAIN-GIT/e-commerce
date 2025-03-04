const express = require("express");
const Coupon = require("../models/coupon");
const { protect, isSeller } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new coupon (Only Sellers)
router.post("/create", protect, isSeller, async (req, res) => {
    try {
        const { code, discountAmount, expiresAt } = req.body;
        const sellerId = req.user._id; // Get logged-in seller's ID

        // Ensure unique coupon code
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({ code, discountAmount, sellerId, expiresAt });
        await newCoupon.save();

        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
