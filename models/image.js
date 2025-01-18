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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true, // Ensure each ML response is linked to a user
    },
    response: {
      type: mongoose.Schema.Types.Mixed, // To store either predicted_class or skin_tone
      required: true, // Make this field required
    },
    imageUrl: {
      type: String,  // URL of the uploaded image (optional)
      required: false, // Optional field, if required, you can set it to true
    },
    confidence: {
      type: Number,  // Confidence level for the prediction (optional)
      required: false,
    },
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);






const MLResponse = mongoose.model('MLResponse', mlResponseSchema);

const Image = mongoose.model('Image', imageSchema);
module.exports = {Image,MLResponse};
