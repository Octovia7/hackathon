const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      url: {
        type: String,
        default: "https://res.cloudinary.com/dl10fq0cu/image/upload/v1731652645/00000000000000000000000000000000_wrtw74.jpg", // Default image URL
      },
      filename: {
        type: String, // Optional: Filename of the uploaded image
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
