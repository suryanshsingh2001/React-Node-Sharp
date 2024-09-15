import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { savePreviewImage } from "../lib/utils";

const router = express.Router();

const originalImagePath = path.resolve(process.cwd(), "uploads", "original.jpeg");
const previewImagePath = path.resolve(process.cwd(), "uploads", "preview.jpeg");



// POST /api/saturation - Adjust image saturation and return a preview
router.post("/", async (req, res) => {
  const { saturation = 100, brightness = 100, contrast = 100 } = req.body;

  console.log(`Adjusting saturation to: ${saturation}`);

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Apply saturation adjustment
    const adjustedSaturation = saturation / 100;

    image = image.modulate({
      brightness: brightness / 100, // Keep brightness unchanged
      saturation: adjustedSaturation, // Adjust saturation
    }).linear(
      contrast / 100, // Keep contrast unchanged
      -(128 * (contrast / 100 - 1)) // Maintain mid-tones
    );

    // Generate and save the preview image
    const previewBuffer = await image.toBuffer();
    await savePreviewImage(previewBuffer, previewImagePath);

    // Respond with preview URL
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error adjusting saturation:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
