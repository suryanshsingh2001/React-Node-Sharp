import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { savePreviewImage } from "../lib/utils";

const router = express.Router();

// Paths for original and preview images
const uploadsDir = path.resolve(process.cwd(), "uploads");
const originalImagePath = path.join(uploadsDir, "original.jpeg");
const previewImagePath = path.join(uploadsDir, "preview.jpeg");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// POST /api/adjustments - Adjust image brightness, saturation, and contrast
router.post("/", async (req, res) => {
  const { brightness = 100, saturation = 100, contrast = 100 } = req.body;

  console.log(`Adjusting: brightness=${brightness}, saturation=${saturation}, contrast=${contrast}`);

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Adjust brightness, saturation, and contrast relative to 1.0 (100%)
    const adjustedBrightness = brightness / 100; // 1.0 means no change
    const adjustedSaturation = saturation / 100; // 1.0 means no change
    const adjustedContrast = contrast / 100; // 1.0 means no change

    // Apply adjustments only if they differ from 100
    image = image.modulate({
      brightness: adjustedBrightness,
      saturation: adjustedSaturation,
    }).linear(adjustedContrast, -(128 * (adjustedContrast - 1)));

    // Generate and save the preview image from the original buffer, not the overwritten image
    const previewBuffer = await image.toBuffer();
    await savePreviewImage(previewBuffer, previewImagePath);

    // Return the preview URL with cache-busting
    res.json({ previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}` });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
