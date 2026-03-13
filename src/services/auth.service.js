const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

class AuthService {
  async registerUser(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userResponse = await User.findById(user._id);

    return { user: userResponse, accessToken, refreshToken };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userResponse = await User.findById(user._id);

    return { user: userResponse, accessToken, refreshToken };
  }

  async updateProfile(userId, updateData) {
    const { name, email } = updateData;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return updatedUser;
  }

  async deleteAccount(userId) {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }
    return deletedUser;
  }

  async logoutUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return true;
  }
}

module.exports = new AuthService();
