import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// POST /api/process - Handle image manipulation (brightness, contrast, etc.)
router.post('/', async (req, res) => {
  const { brightness, contrast, saturation, rotation } = req.body;

  try {
    const imageBuffer = fs.readFileSync(path.join(__dirname, '../uploads', 'image.jpeg'));
    let image = sharp(imageBuffer);

    // Apply brightness, contrast, and saturation adjustments
    image = image.modulate({
      brightness: brightness / 100,
      saturation: saturation / 100,
    });

    // Apply contrast and rotation
    image = image
      .linear(contrast / 100, -(128 * (contrast / 100 - 1)))
      .rotate(rotation);

    // Generate a low-quality preview
    const previewBuffer = await image
      .resize(800)
      .jpeg({ quality: 60 })
      .toBuffer();

    const previewPath = path.join(__dirname, '../uploads', `${Date.now()}.jpeg`);
    fs.writeFileSync(previewPath, previewBuffer);

    res.json({ previewUrl: `/uploads/${path.basename(previewPath)}` });
  } catch (error) {
    res.status(500).json({ message: 'Error processing image' });
  }
});

export default router;
