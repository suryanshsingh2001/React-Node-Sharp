import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const imagePath = path.resolve(process.cwd(), "uploads", `image.jpeg`);


// POST /api/contrast - Adjust image contrast
router.post('/', async (req, res) => {
  const { contrast } = req.body;

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const image = sharp(imageBuffer)
      .linear(contrast / 100, -(128 * (contrast / 100 - 1)));

    const previewBuffer = await image.resize(800).jpeg({ quality: 60 }).toBuffer();
    
    fs.writeFileSync(imagePath, previewBuffer);

    res.json({ previewUrl: `${path.basename(imagePath)}` });
  } catch (error) {
    res.status(500).json({ message: 'Error processing image' });
  }
});

export default router;
