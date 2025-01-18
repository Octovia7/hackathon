const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const imageRoutes = require("./routes/imageRoutes");
const authRoutes = require("./routes/auth.route"); // New authentication routes
const { connectToDatabase } = require("./config/db");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // For handling cookies

// Routes
app.use("/api/images", imageRoutes); // Image-related routes
app.use("/api/auth", authRoutes); // Authentication-related routes

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });
