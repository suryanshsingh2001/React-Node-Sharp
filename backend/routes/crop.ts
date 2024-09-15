import express from 'express'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const router = express.Router()
const originalImagePath = path.resolve(process.cwd(), 'uploads', 'original.jpeg')
const previewImagePath = path.resolve(process.cwd(), 'uploads', 'preview.jpeg')

// Helper function to save the preview image
const savePreviewImage = async (imageBuffer: Buffer, filePath: string) => {
  return sharp(imageBuffer)
    .resize(800) // Low-res for preview
    .jpeg({ quality: 80 }) // Lower quality for speed
    .toFile(filePath)
}

// POST /api/crop - Crop the image and return a preview
router.post('/', async (req, res) => {
  const { croppedArea } = req.body
  try {
    const { x, y, width, height } = croppedArea

    // Read the original high-quality image
    const imageBuffer = fs.readFileSync(originalImagePath)

    // Crop the image using the coordinates
    let image = sharp(imageBuffer).extract({ left: x, top: y, width, height })

    // Save the cropped image as original
    await image.toFile(originalImagePath)

    // Generate a preview version of the cropped image
    const croppedBuffer = await image.toBuffer()
    await savePreviewImage(croppedBuffer, previewImagePath)

    // Send the preview URL with a cache-busting timestamp
    res.json({
      previewUrl: `${path.basename(previewImagePath)}?t=${Date.now()}`,
    })
  } catch (error) {
    console.error('Error cropping image:', error)
    res.status(500).json({ message: 'Error cropping image' })
  }
})

export default router
