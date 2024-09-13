import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// POST /api/crop - Crop the image
router.post('/', async (req, res) => {
  const { width, height, left, top } = req.body;

  try {
    const imageBuffer = fs.readFileSync(path.join(__dirname, '../uploads', 'image.jpeg'));
    const image = sharp(imageBuffer).extract({ width, height, left, top });

    const previewBuffer = await image.resize(800).jpeg({ quality: 60 }).toBuffer();
    const previewPath = path.join(__dirname, '../uploads', `${Date.now()}.jpeg`);
    fs.writeFileSync(previewPath, previewBuffer);

    res.json({ previewUrl: `${path.basename(previewPath)}` });
  } catch (error) {
    res.status(500).json({ message: 'Error cropping image' });
  }
});

export default router;
