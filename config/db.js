const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/health-system");
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = { connectToDatabase };
