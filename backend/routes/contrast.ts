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
    .jpeg({ quality: 80 }) // Lower quality for speed
    .toFile(filePath);
};

// POST /api/contrast - Adjust image contrast and return a preview
router.post("/", async (req, res) => {
  const { contrast = 100, brightness = 100, saturation = 100 } = req.body;

  console.log(`Adjusting contrast to: ${contrast}`);

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Apply contrast adjustment
    const adjustedContrast = contrast / 100;

    image = image.modulate({
      brightness: brightness / 100, // Keep brightness unchanged
      saturation: saturation / 100, // Keep saturation unchanged
    }).linear(
      adjustedContrast, // Adjust contrast
      -(128 * (adjustedContrast - 1)) // Maintain mid-tones
    );

    // Generate and save the preview image
    const previewBuffer = await image.toBuffer();
    await savePreviewImage(previewBuffer, previewImagePath);

    // Respond with preview URL
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error adjusting contrast:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
