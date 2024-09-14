import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Dynamic file paths (without hardcoding the extension)
let originalImagePath = "";
let previewImagePath = "";

// Helper function to save the preview image
const savePreviewImage = async (buffer : Buffer, filePath : any) => {
  return sharp(buffer)
    .resize(800) // Low-quality, resized preview
    .jpeg({ quality: 60 }) // Lower quality for speed
    .toFile(filePath);
};

// POST /api/upload - Handle image uploads and dynamically detect format
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded!" });
  }

  try {
    // Use sharp to detect the format of the uploaded image
    const image = sharp(req.file.buffer);
    // const metadata = await image.metadata();

    // console.log("Detected image format:", metadata.format);

    // Set image paths with appropriate extension based on detected format
    // const extension = metadata.format;
    originalImagePath = path.resolve(process.cwd(), "uploads", `original.jpeg`);
    previewImagePath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);

    // Save the original image
    await image.toFile(originalImagePath);

    // Save the preview image
    await savePreviewImage(req.file.buffer, previewImagePath);

    const previewUrl = `${path.basename(previewImagePath)}?t=${Date.now()}`;
    res.status(200).json({ previewUrl, message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
