import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, env.jwtSecret);

      // Find user and attach to request context (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(new ApiError(401, 'User not found or authorization revoked'));
      }

      return next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized, token validation failed'));
    }
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided'));
  }
};

export default protect;
export { protect as authMiddleware };
