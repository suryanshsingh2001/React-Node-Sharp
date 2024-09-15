import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { savePreviewImage } from "../lib/utils";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Dynamic file paths (without hardcoding the extension)
const originalImagePath = path.resolve(
  process.cwd(),
  "uploads",
  `original.jpeg`
);
const previewImagePath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);



// POST /api/upload - Handle image uploads and dynamically detect format
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded!" });
  }

  try {
    // Use sharp to detect the format of the uploaded image
    const image = sharp(req.file.buffer);
   
    // Save the original image
    await image.toFile(originalImagePath);

    // Save the preview image
    await savePreviewImage(req.file.buffer, previewImagePath);

    const previewUrl = `${path.basename(previewImagePath)}?t=${Date.now()}`;
    res
      .status(200)
      .json({ previewUrl, message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
