import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();
const imagePath = path.resolve(process.cwd(), "uploads", `image.jpeg`);
const previewPath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);

// POST /api/brightness - Adjust image brightness
router.post("/", async (req, res) => {
  const { brightness } = req.body;

  console.log(`brightness` + brightness);

  try {
    // if (fs.existsSync(previewPath)) {
    //   fs.unlinkSync(previewPath);
    // }

    const imageBuffer = fs.readFileSync(imagePath);
    const image = sharp(imageBuffer).modulate({ brightness: brightness / 100 });

    const previewBuffer = await image
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();
    fs.writeFileSync(previewPath, previewBuffer);

    res.json({ previewUrl: `${path.basename(previewPath)}?t=${Date.now()}` });
  } catch (error) {
    res.status(500).json({ message: "Error processing image" });
  }
});

export default router;
