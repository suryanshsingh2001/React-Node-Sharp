import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer to handle image uploads (stored in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define file paths for original and preview images
const uploadsDir = path.resolve(process.cwd(), "uploads");
const originalImagePath = path.join(uploadsDir, "original.jpeg");
const previewImagePath = path.join(uploadsDir, "preview.jpeg");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Helper function to save high-quality images
const saveOriginalImage = async (buffer: Buffer, filePath: string) => {
  return sharp(buffer).jpeg({ quality: 100 }).toFile(filePath);
};

// Helper function to save low-res preview images
const savePreviewImage = async (buffer: Buffer, filePath: string) => {
  return sharp(buffer)
    .resize(800) // Resize for preview (low-quality)
    .jpeg({ quality: 60 }) // Lower quality for quick loading
    .toFile(filePath);
};

// POST /api/upload - Handle image uploads
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded!" });
  }

  try {
    // Save both original and preview images
    await saveOriginalImage(req.file.buffer, originalImagePath);
    await savePreviewImage(req.file.buffer, previewImagePath);

    const previewUrl = `preview-image.jpeg`; 

    // Send response with preview URL
    res.status(200).json({
      previewUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error saving images:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
