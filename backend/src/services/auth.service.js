import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';

const buildAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  businessName: user.businessName,
  mobile: user.mobile,
  email: user.email,
  businessType: user.businessType,
  businessCategory: user.businessCategory,
  preferredLanguage: user.preferredLanguage,
  memberSince: user.createdAt,
});

export const registerUser = async ({
  name,
  businessName,
  mobile,
  email,
  password,
  businessType,
  businessCategory,
  preferredLanguage,
}) => {
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { mobile }],
  });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email or mobile number');
  }

  const user = await User.create({
    name,
    businessName,
    mobile,
    email,
    password,
    businessType,
    businessCategory,
    preferredLanguage,
  });
  const token = generateToken(user._id);

  return {
    user: buildAuthUser(user),
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);
  return {
    user: buildAuthUser(user),
    token,
  };
};

export default {
  registerUser,
  loginUser,
};
