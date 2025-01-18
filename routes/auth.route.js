const express = require('express');
const router = express.Router();
const {
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword,
    checkAuth,
} = require("../controllers/auth.controller.js");

const authenticateToken = require('../middleware/middleware.js');  // Import the authentication middleware

// Define routes
router.post("/login", login);  // Login route
router.post("/logout", logout);  // Logout route
router.post("/signup", signup);  // Signup route (no email verification)
router.post("/forgot-password", forgotPassword);  // Forgot password route
router.post("/reset-password/:token", resetPassword);  // Reset password route
router.get("/check-auth", authenticateToken, checkAuth);  // Protect the check-auth route with middleware

module.exports = router;
