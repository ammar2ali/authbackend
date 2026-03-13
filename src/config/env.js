const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth-db',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'development_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'development_refresh_secret',
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
};

// Removed process.exit on missing secret so that app can run easily locally
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn("WARNING: Missing JWT secret environment variables. Using defaults for development.");
}

module.exports = env;
