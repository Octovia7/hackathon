const express = require("express");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { uploadImage,saveMLResponse ,getAllMLResponses} = require("../controllers/imageController");
const authenticateToken = require('../middleware/middleware.js');  // Import the authentication middleware

const router = express.Router();

// Route to upload an image with ML response
router.post("/upload", authenticateToken, upload.single("image"), uploadImage);

// Route to get all images for the logged-in user
// router.get("/", authenticateToken, getUserImages);
router.post('/ml-response', authenticateToken, saveMLResponse); 
router.get('/ml-responses', getAllMLResponses);
module.exports = router;
