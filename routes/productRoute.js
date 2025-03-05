const express = require('express');
const router = express.Router();
const { protect, isSeller } = require('../middleware/authMiddleware');
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct ,getProductsByCategory} = require('../controllers/productController');

// Route to add a product (Only sellers)
router.post('/add', protect, isSeller, addProduct);

// Get all products (Public)
router.get('/', getAllProducts);

// Get product by ID (Public)
router.get('/:id', getProductById);

// Update product (Only seller who added it)
router.put('/update/:id', protect, isSeller, updateProduct);

// Delete product (Only seller who added it)
router.delete('/delete/:id', protect, isSeller, deleteProduct);


router.get('/category/:category', getProductsByCategory);


module.exports = router;
