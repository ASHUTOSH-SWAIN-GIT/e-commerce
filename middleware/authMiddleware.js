const jwt = require('jsonwebtoken');
const User = require('../models/users');

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Middleware to check if the user is a seller
const isSeller = async (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied! Only sellers are allowed' });
  }
  next();
};

// middleware to check that a user is a buyer
const isBuyer = (req, res, next) => {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Access denied. Buyers only." });
    }
    next();
  };
  
  
  

module.exports = { protect, isSeller, isBuyer };
