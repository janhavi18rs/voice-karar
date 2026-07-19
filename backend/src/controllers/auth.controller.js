import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
};
