import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

const originalImagePath = path.resolve(process.cwd(), "uploads", "original.jpeg");
const previewImagePath = path.resolve(process.cwd(), "uploads", "preview.jpeg");

// Helper function to save preview image
const savePreviewImage = async (imageBuffer: Buffer, filePath: string) => {
  return sharp(imageBuffer)
    .resize(800) // Low-res for preview
    .jpeg({ quality: 60 }) // Lower quality for speed
    .toFile(filePath);
};

// POST /api/saturation - Adjust image saturation and return a preview
router.post("/", async (req, res) => {
  const { saturation } = req.body;

  try {
    // Read the original image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Adjust saturation using modulate
    image = image.modulate({
      saturation: saturation / 100, // Normalize to range [0.0, 2.0], where 1 is default
    });

    // Save the updated original image
    await image.toFile(originalImagePath);

    // Generate and save the preview image
    await savePreviewImage(imageBuffer, previewImagePath);

    // Respond with preview URL and cache-busting
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error adjusting saturation:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
