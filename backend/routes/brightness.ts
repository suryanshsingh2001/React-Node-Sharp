import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

// Directory for uploads
const uploadsDir = path.resolve(process.cwd(), "uploads");

// Dynamic paths for the original and preview images
let originalImagePath = "";
let previewImagePath = "";

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Helper function to detect the image format and set the paths
const setImagePaths = async (imageBuffer : Buffer) => {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const extension = metadata.format;

  // Set the paths based on the detected format
  originalImagePath = path.join(uploadsDir, `original.${extension}`);
  previewImagePath = path.join(uploadsDir, `preview.jpeg`); // Preview is always saved as JPEG
};

// Helper function to save the preview image
const savePreviewImage = async (imageBuffer : Buffer) => {
  return sharp(imageBuffer)
    .resize(800) // Resize for preview (low-quality)
    .jpeg({ quality: 80 }) // Preview always as JPEG with lower quality
    .toFile(previewImagePath);
};

// POST /api/brightness - Adjust image brightness
router.post("/", async (req, res) => {
  const { brightness } = req.body;

  console.log(`Adjusting brightness to: ${brightness}`);

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);

    // Set the image paths dynamically if not already set (in case of first-time processing)
    if (!originalImagePath) {
      await setImagePaths(imageBuffer);
    }

    // Create the sharp instance and adjust brightness
    let image = sharp(imageBuffer).modulate({ brightness: brightness / 100 });

    // Save the updated original image (overwrite the original)
    await image.toFile(originalImagePath);

    // Generate and save the preview image
    const previewBuffer = await image.clone().resize(800).jpeg({ quality: 80 }).toBuffer();
    fs.writeFileSync(previewImagePath, previewBuffer);

    // Return the preview URL with cache-busting
    res.json({ previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}` });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
