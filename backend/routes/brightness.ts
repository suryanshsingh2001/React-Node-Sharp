import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Paths for original and preview images
const uploadsDir = path.resolve(process.cwd(), "uploads");
const originalImagePath = path.join(uploadsDir, "original.jpeg");
const previewImagePath = path.join(uploadsDir, "preview.jpeg");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Helper function to save preview images
const savePreviewImage = async (imageBuffer: Buffer, filePath: string) => {
  return sharp(imageBuffer)
    .resize(800) // Resize for preview (low-quality)
    .jpeg({ quality: 80 }) // Lower quality for preview
    .toFile(filePath);
};

// POST /api/brightness - Adjust image brightness
router.post("/", async (req, res) => {
  const { brightness } = req.body;

  console.log(`Adjusting brightness to: ${brightness}`);

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);
    let image = sharp(imageBuffer);

    // Adjust brightness
    image = image.modulate({ brightness: brightness / 100 });

    // Save the updated original image
    await image.toFile(originalImagePath); // Overwrite the original

    // Generate and save the preview image
    await savePreviewImage(imageBuffer, previewImagePath);

    // Return the preview URL with cache-busting
    res.json({ previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}` });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;