const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/users.js");

// Sign-up function
const signup = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("All fields are required");
        }

        // Check if the email already exists
        const userEmailAlreadyExists = await User.findOne({ email });
        if (userEmailAlreadyExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
        });

        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        // Optionally set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Include the token in the response body
        res.status(201).json({
            success: true,
            message: "User created successfully and logged in.",
            token,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login function
const login = async function (req, res) {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Validate the password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        // Optionally set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Include the token in the response body
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
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
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
};
