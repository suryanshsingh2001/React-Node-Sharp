import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { savePreviewImage } from "../lib/utils";


const uploadDir = path.resolve(process.cwd(), 'uploads');
const originalImagePath = path.join(uploadDir, 'original.jpeg');
const croppedImagePath = path.join(uploadDir, 'cropped.jpeg');
const previewImagePath = path.join(uploadDir, 'preview.jpeg');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const router = express.Router();



router.post('/', async (req, res) => {
  const { croppedAreaPixels, zoom=1, naturalWidth, naturalHeight } = req.body;

  if (!croppedAreaPixels || !naturalWidth || !naturalHeight) {
    return res.status(400).json({ message: 'Required crop data is missing' });
  }

  try {
    const { x, y, width, height } = croppedAreaPixels;

    if (!fs.existsSync(originalImagePath)) {
      return res.status(404).json({ message: 'Original image not found' });
    }

    const imageBuffer = fs.readFileSync(originalImagePath);
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if(metadata.width === undefined || metadata.height === undefined) {
      return res.status(500).json({ message: 'Error reading image metadata' });
    }

    // Calculate the scale factor between the natural image size and the actual image size
    const scaleX = metadata.width / naturalWidth;
    const scaleY = metadata.height / naturalHeight;

    // Calculate the actual crop area based on zoom and scale
    const actualCropWidth = (width / zoom) * scaleX;
    const actualCropHeight = (height / zoom) * scaleY;
    const actualX = (x / zoom) * scaleX;
    const actualY = (y / zoom) * scaleY;

    // Ensure the crop area is within the image boundaries
    const cropX = Math.max(0, Math.min(actualX, metadata.width - actualCropWidth));
    const cropY = Math.max(0, Math.min(actualY, metadata.height - actualCropHeight));
    const cropWidth = Math.min(actualCropWidth, metadata.width - cropX);
    const cropHeight = Math.min(actualCropHeight, metadata.height - cropY);

    if (cropWidth <= 0 || cropHeight <= 0) {
      return res.status(400).json({ message: 'Invalid crop dimensions' });
    }

    // Crop the image
    const croppedImage = image.extract({
      left: Math.round(cropX),
      top: Math.round(cropY),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    });

    // Save the cropped image
    await croppedImage.toFile(croppedImagePath);

    // Generate a preview image
    const croppedBuffer = await croppedImage.toBuffer();

    fs.writeFileSync(originalImagePath, croppedBuffer);
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