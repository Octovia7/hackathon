const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/health-system";

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,       // Ensure the new URL parser is used
      useUnifiedTopology: true,   // Use the new server discovery and monitoring engine
      serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds if server isn't reachable
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error("Detailed error:", error);
  }
};

module.exports = { connectToDatabase };

