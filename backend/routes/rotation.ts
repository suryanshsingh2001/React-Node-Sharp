import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();
const originalImagePath = path.resolve(
  process.cwd(),
  "uploads",
  `original.jpeg`
);
const previewImagePath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);

// Helper function to save preview image
const savePreviewImage = async (imageBuffer: Buffer, filePath: string) => {
  return sharp(imageBuffer)
    .resize(800) // Low-res for preview
    .jpeg({ quality: 60 }) // Lower quality for speed
    .toFile(filePath);
};

// POST /api/rotate - Rotate the image and return a preview
router.post("/", async (req, res) => {
  const { rotation } = req.body;

  try {
    // Read the original high-quality image
    const imageBuffer = fs.readFileSync(originalImagePath);

    // Apply rotation to the original image
    let image = sharp(imageBuffer).rotate(rotation, { background: { r: 255, g: 255, b: 255, alpha: 0 } });

    // Save the updated original image (if required, you can omit this if you don't want to overwrite)
    await image.toFile(originalImagePath);

    // Generate and save the preview image
    const rotatedBuffer = await image.toBuffer(); // Get the rotated image buffer
    await savePreviewImage(rotatedBuffer, previewImagePath); // Create a preview version from the rotated image

    // Respond with the preview URL and cache-busting
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    });
  } catch (error) {
    console.error("Error rotating image:", error);
    res.status(500).json({ message: "Error rotating image" });
  }
});

export default router;
