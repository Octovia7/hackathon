const { Image, MLResponse} = require("../models/image");

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

const saveMLResponse = async (req, res) => {
    try {
      const { mlResponse, imageId } = req.body; // Extract ML response and imageId from the request body
  
      // Validate that both mlResponse and imageId are provided
      if (!mlResponse || !imageId) {
        return res.status(400).json({ success: false, message: "ML response and image ID are required." });
      }
  
      // Fetch the image using the imageId
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(404).json({ success: false, message: "Image not found." });
      }
  
      // Step 1: Save the ML response in the MLResponse collection, linking to the image
      const newMLResponse = new MLResponse({
        image: imageId, // Link to the image
        prediction: mlResponse.prediction,
        confidence: mlResponse.confidence,
        analysis: mlResponse.analysis,
      });
  
      await newMLResponse.save();
  
      // Step 2: Respond to the frontend with the saved ML response
      res.status(201).json({
        success: true,
        message: "ML response saved successfully",
        data: newMLResponse, // Send back the ML response data
      });
    } catch (error) {
      console.error("Error saving ML response:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

  

// Fetch all images uploaded by the user and their ML responses
const getAllMLResponses = async (req, res) => {
    try {
      // Fetch all ML responses and populate the associated image data
      const mlResponses = await MLResponse.find().populate('image'); // Populating 'image' field with Image model data
  
      // Check if no ML responses were found
      if (mlResponses.length === 0) {
        return res.status(404).json({ success: false, message: "No ML responses found." });
      }
  
      // Respond with all the ML responses and their associated images
      res.status(200).json({
        success: true,
        data: mlResponses, // Array of ML responses with populated image data
      });
    } catch (error) {
      console.error("Error fetching ML responses:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };


module.exports = {
  uploadImage,
  saveMLResponse ,
  getAllMLResponses
};


