  import express from "express";
  import multer from "multer";
  import sharp from "sharp";
  import path from "path";
  import fs from "fs";

  const router = express.Router();

  // Configure multer to handle image uploads
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // Resolve the image path relative to the project root
  const imagePath = path.resolve(process.cwd(), "uploads", `image.jpeg`);
  const previewPath = path.resolve(process.cwd(), "uploads", `preview.jpeg`);

  // Helper function to save images
  const savePreviewImage = async (buffer: Buffer, filePath: string) => {
    return sharp(buffer)
      .resize(800) // Resize image for preview (low-quality)
      .jpeg({ quality: 60 }) // Lower quality for speed
      .toFile(filePath);
  };

  // POST /api/upload - Handle image uploads
  router.post("/", upload.single("image"), async (req, res) => {

    console.log(req.file);
    console.log(imagePath); // This will now log the correct path to the 'uploads' folder

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded!" });
    }

    try {
      await savePreviewImage(req.file.buffer, imagePath);
      const previewUrl = `${path.basename(imagePath)}`; // Adjusted URL for frontend
      console.log(previewUrl);

      // Send success response
      res
        .status(200)
        .json({ previewUrl, message: "Image uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error processing image" });
    }
  });

  export default router;
