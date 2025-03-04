const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Categorization
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Seller reference
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
