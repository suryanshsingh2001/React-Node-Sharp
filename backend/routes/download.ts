import express from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
const exportDir = path.resolve(process.cwd(), "exports");

// Ensure the export directory exists
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir);
}

// POST /api/export - Apply changes and export the high-quality image
router.post("/", async (req, res) => {
  try {
    const { format, brightness, contrast, saturation, rotation } = req.body; // Image parameters
    const imageBuffer = fs.readFileSync(path.join(uploadsDir, "original.jpeg"));

    // Apply all modifications
    let modifiedImage = sharp(imageBuffer);

    // Adjust brightness, contrast, and saturation if necessary
    if (brightness || contrast || saturation) {
      if (brightness || saturation) {
        modifiedImage = modifiedImage.modulate({
          brightness: brightness ? brightness / 100 : 1, // Default is 100%
          saturation: saturation ? saturation / 100 : 1, // Default is 100%
        });
      }

      if (contrast) {
        modifiedImage = modifiedImage.linear(contrast / 100, 0); // Adjust contrast
      }
    }

    // Apply rotation if needed
    if (rotation) {
      modifiedImage = modifiedImage.rotate(rotation);
    }

    // Convert to the requested format and export
    const convertedImage = await modifiedImage.toFormat(format).toBuffer();

    // Save the high-quality image to the export directory
    const exportPath = path.join(exportDir, `exported_image.${format}`);
    fs.writeFileSync(exportPath, convertedImage);

    // Send the preview URL for the frontend to download the image
    console.log("Image exported successfully", exportPath);

    res.status(200).json({ url: `${path.basename(exportPath)}` });
  } catch (error) {
    console.error("Error exporting image:", error);
    res.status(500).json({ message: "Error exporting image" });
  }
});

export default router;
