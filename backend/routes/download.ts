import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { format } = req.body; // e.g., 'jpeg', 'png'
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const exportDir = path.resolve(process.cwd(), "exports");
    const imageBuffer = fs.readFileSync(path.join(uploadsDir, "original.jpeg"));

    const convertedImage = await sharp(imageBuffer).toFormat(format).toBuffer();

    const exportPath = path.join(exportDir, `original.${format}`);

    fs.writeFileSync(exportPath, convertedImage);

    // Send the preview URL for the frontend to download

    console.log("Image converted successfully", exportPath);

    res.status(200).json({ previewUrl: path.basename(exportPath) });





  } catch (error) {
    res.status(500).json({ message: "Error converting image" });
  }
});

export default router;
