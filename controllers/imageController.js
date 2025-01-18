const { Image, MLResponse } = require("../models/image");
const User = require("../models/users");
const uploadImage = async (req, res) => {
  try {
    const userId = req.userId; // User ID from JWT middleware
    const imageUrl = req.file.path; // URL from Cloudinary
    const filename = req.file.filename; // Filename from Cloudinary

    // Step 1: Save the image data
    const newImage = new Image({
      user: userId, // Link the image to the user
      image: {
        url: imageUrl, // Cloudinary URL of the uploaded image
        filename: filename, // Filename of the uploaded image
      },
    });

    // Save the image to the database
    await newImage.save();

    // Step 2: Send back the image ID in the response
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageId: newImage._id, // Send the image ID
        imageUrl: imageUrl, // Optionally send the image URL
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Save ML response function


// Save ML response function
const saveMLResponse = async (req, res) => {
  try {
      const { predicted_class, skin_tone, message, imageUrl, confidence } = req.body; // Extract fields from the request body
      const userId = req.userId; // Get the userId from the authenticated user (assuming JWT middleware)

      // Validate that either predicted_class, skin_tone, or message is provided
      if (!predicted_class && !skin_tone && !message) {
          return res.status(400).json({ success: false, message: "Either predicted_class, skin_tone or message is required." });
      }

      // Ensure that the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Determine which key (predicted_class, skin_tone, or message) to store in the response field
      let response = {};

      // Assign the field based on which value is provided
      if (predicted_class) {
          response = { predicted_class };
      } else if (skin_tone) {
          response = { skin_tone };
      } else if (message) {
          response = { message };
      }

      // Step 1: Save the ML response in the MLResponse collection, linking to the user
      const newMLResponse = new MLResponse({
          user: user._id, // Link the ML response to the user
          response: response, // Save either predicted_class, skin_tone, or message in the response
          imageUrl: imageUrl,  // Optional image URL
          confidence: confidence,  // Optional confidence level
      });

      await newMLResponse.save();

      // Step 2: Respond to the frontend with the saved ML response
      res.status(201).json({
          success: true,
          message: "ML response saved successfully",
          data: {
              mlResponse: newMLResponse, // Include the full ML response data
          },
      });
  } catch (error) {
      console.error("Error saving ML response:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all ML responses function
const getMLResponses = async (req, res) => {
  try {
    const userId = req.userId; // Get the userId from the authenticated user (assuming JWT middleware)

    // Debug: Log the userId to check if it's coming through correctly
    console.log("User ID from token:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access, no user ID." });
    }

    // Fetch all ML responses associated with the user
    const mlResponses = await MLResponse.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort by createdAt to get the latest responses

    // Debug: Log the fetched responses
    console.log("Fetched ML Responses:", mlResponses);

    // If no responses are found, return a 404 error
    if (mlResponses.length === 0) {
      return res.status(404).json({ success: false, message: "No ML responses found." });
    }

    // Return the ML responses to the frontend
    res.status(200).json({
      success: true,
      data: mlResponses, // Return the ML responses
    });
  } catch (error) {
    console.error("Error fetching ML responses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single ML response by ID


module.exports = {
  uploadImage,
  saveMLResponse,
  getMLResponses,
};


