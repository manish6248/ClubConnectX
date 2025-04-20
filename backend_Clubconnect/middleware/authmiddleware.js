

import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

import ErrorResponse from '../utils/errorResponse.js'; // Ensure this utility exists

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized', 401));
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Ensure user is attached to the request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};




// Role-based access control
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `Role ${req.user.role} is not authorized to access this route`,
        403
      )
    );
  }
  next();
};

export { protect, authorize, auth};