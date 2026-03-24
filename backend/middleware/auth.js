const jwt = require('jsonwebtoken');//import jsonwebtoken library used to verrify token
const User = require('../models/User');

/**
 * Verify JWT and attach user to request
 */
const protect = async (req, res, next) => {//middleware function to protect routes (requires login)
  try {
    let token;//declare token variable

    if (//authorization header exist starts with bearer
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];//extract token from header Ex.Bearer abc123 --> abc123 
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);//verfiy token using secret key and return decoded payloads
    const user = await User.findById(decoded.id).select('-password');//fetch user with Database using ID from token also exclude password

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or user no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    req.user = user;//attach user with request object
    next();// move to next middleware/controller
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    next(error);
  }
};


const authorize = (...roles) => {//function that accept roles
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(' or ')}.`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };