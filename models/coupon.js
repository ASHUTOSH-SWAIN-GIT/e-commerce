const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Unique coupon code
    discountAmount: { type: Number, required: true }, // Discount value
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Seller who created it
    expiresAt: { type: Date, required: true }, // Expiry date for coupon
}, { timestamps: true });

module.exports = mongoose.model("Coupon", CouponSchema);
