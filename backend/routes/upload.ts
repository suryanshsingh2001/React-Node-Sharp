import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer to handle image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to save images
const saveImage = async (buffer: Buffer, filePath: string) => {
  return sharp(buffer)
    .resize(800) // Resize image for preview (low-quality)
    .jpeg({ quality: 60 }) // Lower quality for speed
    .toFile(filePath);
};

// POST /api/upload - Handle image uploads
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded!" });
  }

  const imagePath = path.join(__dirname, "../uploads", `${Date.now()}.jpeg`);

  try {
    await saveImage(req.file.buffer, imagePath);
    const previewUrl = `${path.basename(imagePath)}`;
    
    // Send success response
    res.status(200).json({ previewUrl, message: "Image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
