const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generates an access token
 * @param {ObjectId|string} userId
 * @returns {string} token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiration }
  );
};

/**
 * Generates a refresh token
 * @param {ObjectId|string} userId
 * @returns {string} token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiration }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
