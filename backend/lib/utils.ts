import sharp from "sharp";
import fs from "fs";
import path from "path";

export const savePreviewImage = async (
  imageBuffer: Buffer,
  filePath: string
) => {
  return sharp(imageBuffer)
    .resize(800) // Resize for preview (low-quality)
    .jpeg({ quality: 80 }) // Lower quality for preview
    .toFile(filePath);
};

export const clearAllFilesInFolder = (folderPath: string) => {
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
