const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/Usercontroller');
const { protect } = require('../middleware/authMiddleware');
const { addBalance } = require('../controllers/Usercontroller');

const router = express.Router();

router.post('/register', registerUser);  // Register User
router.post('/login', loginUser);        // Login User
// router.get('/profile', protect, getUserProfile); // Get User Profile (Protected Route)
router.post("/add-balance", protect, addBalance);

module.exports = router;
