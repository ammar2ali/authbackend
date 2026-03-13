const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(env.mongodbUri);
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
