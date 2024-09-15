import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(process.cwd(), 'uploads');
const originalImagePath = path.join(uploadDir, 'original.jpeg');
const croppedImagePath = path.join(uploadDir, 'cropped.jpeg');
const previewImagePath = path.join(uploadDir, 'preview.jpeg');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const router = express.Router();

const savePreviewImage = async (imageBuffer: Buffer, filePath: string) => {
  return sharp(imageBuffer)
    .resize(800)
    .jpeg({ quality: 80 })
    .toFile(filePath);
};

router.post('/', async (req, res) => {
  const { croppedArea } = req.body;

  if (!croppedArea) {
    return res.status(400).json({ message: 'Cropped area data is missing' });
  }

  try {
    const { x, y, width, height } = croppedArea;

    console.log(`Cropping image to: x=${x}, y=${y}, width=${width}, height=${height}`);

    // Check if the original image exists
    if (!fs.existsSync(originalImagePath)) {
      return res.status(404).json({ message: 'Original image not found' });
    }

    // Read the original image dimensions
    const originalImage = sharp(originalImagePath);
    const metadata = await originalImage.metadata();

    // Clamp the crop area to fit within the image boundaries
    if (metadata.width === undefined || metadata.height === undefined) {
      return res.status(500).json({ message: 'Error reading image metadata' });
    }

    const cropX = Math.max(0, Math.min(x, metadata.width - width));
    const cropY = Math.max(0, Math.min(y, metadata.height - height));
    const cropWidth = Math.min(width, metadata.width - cropX);
    const cropHeight = Math.min(height, metadata.height - cropY);

    // Ensure width and height are positive
    if (cropWidth <= 0 || cropHeight <= 0) {
      return res.status(400).json({ message: 'Invalid crop dimensions' });
    }

    // Crop the image
    const croppedImage = originalImage.extract({
      left: Math.round(cropX),
      top: Math.round(cropY),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    });

    // Save the cropped image
    await croppedImage.toFile(croppedImagePath);

    // Generate a preview image
    const croppedBuffer = await croppedImage.toBuffer();



    
    await savePreviewImage(croppedBuffer, previewImagePath);

    // Send back the preview URL with a timestamp
    res.json({
      previewUrl: `preview.jpeg?t=${Date.now()}`,
    });
  } catch (error) {
    console.error('Error cropping image:', error);
    res.status(500).json({ message: 'Error cropping image' });
  }
});

export default router;
