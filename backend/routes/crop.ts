import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Paths for original and preview images
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const originalImagePath = path.join(uploadsDir, 'original.jpeg'); // Ensure this is set correctly
const previewImagePath = path.join(uploadsDir, 'preview.jpeg');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Helper function to save cropped images
const saveCroppedImage = async (
  imageBuffer: Buffer,
  cropData: { x: number; y: number; width: number; height: number },
  outputPath: string
) => {
  return sharp(imageBuffer)
    .extract({
      left: Math.round(cropData.x),
      top: Math.round(cropData.y),
      width: Math.round(cropData.width),
      height: Math.round(cropData.height),
    })
    .toFile(outputPath);
};

// POST /api/crop - Crop the image
router.post('/', async (req, res) => {
  const { x, y, width, height } = req.body;

  try {
    // Load the original image
    const imageBuffer = fs.readFileSync(originalImagePath);

    // Crop the image using the pixel dimensions provided
    await saveCroppedImage(imageBuffer, { x, y, width, height }, previewImagePath);

    // Return the new preview URL
    res.json({ previewUrl: `preview.jpeg?t=${Date.now()}` });
  } catch (error) {
    console.error('Error cropping image:', error);
    res.status(500).json({ message: 'Error cropping image' });
  }
});

export default router;
