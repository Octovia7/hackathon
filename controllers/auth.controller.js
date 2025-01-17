const User = require("../models/users.js");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} = require("../mailtrap/email.js");

// Sign-up function
const signup = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const userEmailAlreadyExists = await User.findOne({ email });
        if (userEmailAlreadyExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // Automatically log in the user by generating a token
        generateTokenAndSetCookie(res, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email.",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Email verification function
const verifyEmail = async function (req, res) {
    const { code } = req.body; // Verification token
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login function
const login = async function (req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email first" });
        }
        generateTokenAndSetCookie(res, user._id);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Forgot password function
const forgotPassword = async function (req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Reset password function
const resetPassword = async function (req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout function
const logout = function (req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Check authentication function
const checkAuth = async function (req, res) {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    signup,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
};
