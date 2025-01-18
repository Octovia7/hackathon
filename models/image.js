const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            url: { type: String, required: true }, // Cloudinary URL
            filename: { type: String },
        },
    },
    { timestamps: true }
);
const mlResponseSchema = new mongoose.Schema(
    {
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',  // Reference to the Image model
            required: true,
        },
        prediction: { type: String },  // e.g., "Healthy"
        confidence: { type: Number },  // e.g., 0.95
        analysis: {
            skinTone: { type: String },  // e.g., "Fair"
            spotsDetected: { type: Boolean },  // e.g., true/false
            wrinklesDetected: { type: Boolean },  // e.g., true/false
        },
    },
    { timestamps: true }
);

const MLResponse = mongoose.model('MLResponse', mlResponseSchema);

const Image = mongoose.model('Image', imageSchema);
module.exports = {Image,MLResponse};
