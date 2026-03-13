const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { generateAccessToken } = require('../utils/generateTokens');

const accessCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

/**
 * Authentication middleware that handles auto token refresh logic via cookies
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Read token from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (accessToken) {
      try {
        // 2. Verify access token
        const decoded = jwt.verify(accessToken, env.jwtAccessSecret);
        
        const user = await User.findById(decoded._id);
        if (!user) {
          return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = user;
        return next();
      } catch (error) {
        // If access token is expired, we fall through to check the refresh token
        if (error.name !== 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: "Unauthorized" });
        }
      }
    }

    // 3. Handle expired access token (or missing access token but we have refresh token)
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
      // Decode refresh token
      const decodedRefresh = jwt.verify(refreshToken, env.jwtRefreshSecret);
      
      const user = await User.findById(decodedRefresh._id).select('+refreshToken');
      
      // Verify user exists and DB refresh token matches the provided one
      if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user._id);
      
      // Update accessToken cookie
      res.cookie("accessToken", newAccessToken, accessCookieOptions);

      req.user = user;
      return next();

    } catch (refreshErr) {
      // 4. If refresh token invalid/expired, clear cookies and reject
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
