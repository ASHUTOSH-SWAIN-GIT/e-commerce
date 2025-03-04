const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/Usercontroller');
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);  // Register User
router.post('/login', loginUser);        // Login User
// router.get('/profile', protect, getUserProfile); // Get User Profile (Protected Route)

module.exports = router;
