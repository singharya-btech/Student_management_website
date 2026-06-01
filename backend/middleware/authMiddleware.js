import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect Routes Middleware
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded ID and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Move to next middleware
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);

      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Admin Only Middleware
export const adminOnly = (req, res, next) => {
  // Check user role
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required',
    });
  }
};