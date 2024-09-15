import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { savePreviewImage } from "../lib/utils";

const router = express.Router();
const originalImagePath = path.resolve(
  process.cwd(),
  "uploads",
  "original.jpeg"
);
const previewImagePath = path.resolve(process.cwd(), "uploads", "preview.jpeg");

// POST /api/rotate - Rotate the image, apply brightness, contrast, and saturation, and return a preview
router.post("/", async (req, res) => {
  const {
    rotation,
    brightness = 100,
    contrast = 100,
    saturation = 100,
  } = req.body;

  try {
    // Read the original high-quality image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Apply brightness, contrast, and saturation adjustments using `modulate`
    const adjustedBrightness = brightness / 100; // 1.0 means no change
    const adjustedSaturation = saturation / 100; // 1.0 means no change
    const adjustedContrast = contrast / 100; // 1.0 means no change

    // Apply adjustments only if they differ from 100
    image = image
      .modulate({
        brightness: adjustedBrightness,
        saturation: adjustedSaturation,
      })
      .linear(adjustedContrast, -(128 * (adjustedContrast - 1)))
      .rotate(rotation, { background: { r: 255, g: 255, b: 255, alpha: 1 } });

    // Generate a preview of the adjusted and rotated image
    const rotatedBuffer = await image.toBuffer();
    await savePreviewImage(rotatedBuffer, previewImagePath); // Create a preview version

    // Send the preview URL with a cache-busting timestamp
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
