import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Dynamic file paths for the uploads folder
const uploadsFolder = path.resolve(process.cwd(), "uploads");
const exportsFolder = path.resolve(process.cwd(), "exports");

// Helper function to delete all files in the uploads folder
const clearAllFilesInFolder = (folderPath: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return reject(err);
      }

      const deletePromises = files.map((file) => {
        const filePath = path.join(folderPath, file);
        return new Promise<void>((res, rej) => {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              return rej(unlinkErr);
            }
            res();
          });
        });
      });

      Promise.all(deletePromises)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  });
};

// GET /api/reset - Clears all images in the uploads folder
router.get("/", async (req, res) => {
  try {
    // Check if the uploads folder exists
    if (fs.existsSync(uploadsFolder)) {
      await clearAllFilesInFolder(uploadsFolder);
      await clearAllFilesInFolder(exportsFolder);
      res
        .status(200)
        .json({ message: "All images have been removed from uploads folder." });
    } else {
      res.status(400).json({ message: "Uploads folder does not exist." });
    }
  } catch (error) {
    console.error("Error clearing uploads folder:", error);
    res.status(500).json({ message: "Error clearing uploads folder." });
  }
});

export default router;
