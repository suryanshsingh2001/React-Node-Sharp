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

// POST /api/contrast - Adjust image contrast and return a preview
router.post("/", async (req, res) => {
  const { contrast } = req.body;

  try {
    // Read original image
    const imageBuffer = fs.readFileSync(originalImagePath);

    // Adjust contrast using linear
    let image = sharp(imageBuffer).linear(
      contrast / 100, // Multiplier for contrast (1 = no change, >1 = more contrast, <1 = less contrast)
      -(128 * (contrast / 100 - 1)) // Brightness offset to maintain mid-tones
    );

    // Save the updated original image
    await image.toFile(originalImagePath);

    // Generate and save the preview image
    await savePreviewImage(await image.toBuffer(), previewImagePath);

    // Respond with preview URL and cache-busting
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error adjusting contrast:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
