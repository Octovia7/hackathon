const { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates.js");
const  transporter  = require("./mailtrap.config.js");

const sendVerificationEmail = async function(email, verificationToken) {
    try {
        const mailOptions = {
            from: `"rudraksh" <rudrasoni1414@gmail.com>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error("Error sending verification email: " + error);
    }
};

const sendWelcomeEmail = async function(email, name) {
    try {
        const mailOptions = {
            from: `"rudraksh" <rudrasoni1414@gmail.com>`,
            to: email,
            subject: "Welcome to Our Service",
            html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining us.</p>`,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error("Error sending welcome email: " + error);
    }
};

const sendPasswordResetEmail = async function(email, resetURL) {
    try {
        const mailOptions = {
            from: `"rudraksh" <rudrasoni1414@gmail.com>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error("Error sending password reset email: " + error);
    }
};

const sendResetSuccessEmail = async function(email) {
    try {
        const mailOptions = {
            from: `"rudraksh" <rudrasoni1414@gmail.com>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error("Error sending password reset success email: " + error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail
};
