require('dotenv').config(); 
const mongoose = require('mongoose');

const dbConfig = {
  url: process.env.MONGO_URL
};
const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
