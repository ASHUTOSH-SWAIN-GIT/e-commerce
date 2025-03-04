const Product = require('../models/product');
const User = require('../models/users');

// @desc    Add a new product (Only seller can add)
// @route   POST /api/products/add
// @access  Seller only
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sellerId } = req.body;

    // Check if sellerId exists and is a seller
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(403).json({ message: 'Invalid seller ID. Only sellers can add products' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      seller: sellerId, // Assign seller's ID to the product
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Only seller who owns it can update)
// @route   PUT /api/products/:id
// @access  Seller only
const updateProduct = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ message: 'Unauthorized! Only the seller can update this product' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Only seller who owns it can delete)
// @route   DELETE /api/products/:id
// @access  Seller only
const deleteProduct = async (req, res) => {
  try {
    const { sellerId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ message: 'Unauthorized! Only the seller can delete this product' });
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
    try {
      const category = req.params.category;
      const products = await Product.find({ category });
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found in this category" });
      }
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct , getProductsByCategory };
