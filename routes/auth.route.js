const express = require('express');
const router = express.Router();
const {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
} = require("../controllers/auth.controller.js");

const authenticateToken = require('../middleware/middleware.js');  // Import the authentication middleware

// Define routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", authenticateToken, checkAuth);  // Protect the check-auth route with middleware

module.exports = router;
