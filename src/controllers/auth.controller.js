const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const accessCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) throw new ApiError(400, "All fields are required");

      const { user, accessToken, refreshToken } = await authService.registerUser({ name, email, password });
      
      res
        .status(201)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(201, "User registered successfully", { user }));
    } catch (error) { next(error); }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new ApiError(400, "Email and password are required");

      const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
      
      res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, "User logged in successfully", { user }));
    } catch (error) { next(error); }
  };

  getProfile = async (req, res, next) => {
    try {
      res.status(200).json(new ApiResponse(200, "User profile fetched successfully", req.user));
    } catch (error) { next(error); }
  };

  updateProfile = async (req, res, next) => {
    try {
      const updatedUser = await authService.updateProfile(req.user._id, req.body);
      res.status(200).json(new ApiResponse(200, "User profile updated successfully", updatedUser));
    } catch (error) { next(error); }
  };

  deleteAccount = async (req, res, next) => {
    try {
      await authService.deleteAccount(req.user._id);
      
      res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, "User account deleted successfully"));
    } catch (error) { next(error); }
  };

  logout = async (req, res, next) => {
    try {
      await authService.logoutUser(req.user._id);
      
      res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, "User logged out successfully"));
    } catch (error) { next(error); }
  };
}

module.exports = new AuthController();
