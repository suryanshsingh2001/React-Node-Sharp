import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();
const imagePath = path.resolve(process.cwd(), "uploads", `image.jpeg`);
const previewPath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);

// POST /api/rotate - Rotate the image and delete the previous version
router.post("/", async (req, res) => {
  const { rotation } = req.body;

  try {
    // Check if a previous preview image exists and delete it
    // if (fs.existsSync(previewPath)) {
    //   fs.unlinkSync(previewPath);
    // }

    const imageBuffer = fs.readFileSync(imagePath);
    const image = sharp(imageBuffer).rotate(rotation);

    const previewBuffer = await image
      .resize(800)
      .jpeg({ quality: 60 })
      .toBuffer();
    fs.writeFileSync(previewPath, previewBuffer);

    // Append a cache-busting query string (timestamp)
    res.json({ previewUrl: `${path.basename(previewPath)}?t=${Date.now()}` });
  } catch (error) {
    res.status(500).json({ message: "Error rotating image" });
  }
});

export default router;
