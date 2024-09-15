"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.resolve(process.cwd(), 'uploads');
const originalImagePath = path_1.default.join(uploadDir, 'original.jpeg');
const croppedImagePath = path_1.default.join(uploadDir, 'cropped.jpeg');
const previewImagePath = path_1.default.join(uploadDir, 'preview.jpeg');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const router = express_1.default.Router();
const savePreviewImage = (imageBuffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(filePath);
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { croppedArea } = req.body;
    if (!croppedArea) {
        return res.status(400).json({ message: 'Cropped area data is missing' });
    }
    try {
        const { x, y, width, height } = croppedArea;
        console.log(`Cropping image to: x=${x}, y=${y}, width=${width}, height=${height}`);
        // Check if the original image exists
        if (!fs_1.default.existsSync(originalImagePath)) {
            return res.status(404).json({ message: 'Original image not found' });
        }
        // Read the original image dimensions
        const originalImage = (0, sharp_1.default)(originalImagePath);
        const metadata = yield originalImage.metadata();
        // Clamp the crop area to fit within the image boundaries
        if (metadata.width === undefined || metadata.height === undefined) {
            return res.status(500).json({ message: 'Error reading image metadata' });
        }
        const cropX = Math.max(0, Math.min(x, metadata.width - width));
        const cropY = Math.max(0, Math.min(y, metadata.height - height));
        const cropWidth = Math.min(width, metadata.width - cropX);
        const cropHeight = Math.min(height, metadata.height - cropY);
        // Ensure width and height are positive
        if (cropWidth <= 0 || cropHeight <= 0) {
            return res.status(400).json({ message: 'Invalid crop dimensions' });
        }
        // Crop the image
        const croppedImage = originalImage.extract({
            left: Math.round(cropX),
            top: Math.round(cropY),
            width: Math.round(cropWidth),
            height: Math.round(cropHeight),
        });
        // Save the cropped image
        yield croppedImage.toFile(croppedImagePath);
        // Generate a preview image
        const croppedBuffer = yield croppedImage.toBuffer();
        yield savePreviewImage(croppedBuffer, previewImagePath);
        // Send back the preview URL with a timestamp
        res.json({
            previewUrl: `preview.jpeg?t=${Date.now()}`,
        });
    }
    catch (error) {
        console.error('Error cropping image:', error);
        res.status(500).json({ message: 'Error cropping image' });
    }
}));
exports.default = router;
