import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// POST /api/convert - Convert image format (e.g., PNG to JPEG)
router.post('/', async (req, res) => {
  try {
    const { format } = req.body; // e.g., 'jpeg', 'png'
    const imageBuffer = fs.readFileSync(path.join(__dirname, '../uploads', 'image.jpeg'));
    
    const convertedImage = await sharp(imageBuffer)
      .toFormat(format)
      .toBuffer();

    const outputPath = path.join(__dirname, '../uploads', `${Date.now()}.${format}`);
    fs.writeFileSync(outputPath, convertedImage);

    res.json({ previewUrl: `${path.basename(outputPath)}` });
  } catch (error) {
    res.status(500).json({ message: 'Error converting image' });
  }
});

export default router;
