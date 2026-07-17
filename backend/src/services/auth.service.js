import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async ({ name, email, password }) => {
  // Placeholder logic shell
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  // Placeholder logic shell
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);
  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

export default {
  registerUser,
  loginUser,
};
