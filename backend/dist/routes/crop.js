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
    const { croppedAreaPixels, zoom = 1, naturalWidth, naturalHeight } = req.body;
    if (!croppedAreaPixels || !naturalWidth || !naturalHeight) {
        return res.status(400).json({ message: 'Required crop data is missing' });
    }
    try {
        const { x, y, width, height } = croppedAreaPixels;
        if (!fs_1.default.existsSync(originalImagePath)) {
            return res.status(404).json({ message: 'Original image not found' });
        }
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        const image = (0, sharp_1.default)(imageBuffer);
        const metadata = yield image.metadata();
        if (metadata.width === undefined || metadata.height === undefined) {
            return res.status(500).json({ message: 'Error reading image metadata' });
        }
        // Calculate the scale factor between the natural image size and the actual image size
        const scaleX = metadata.width / naturalWidth;
        const scaleY = metadata.height / naturalHeight;
        // Calculate the actual crop area based on zoom and scale
        const actualCropWidth = (width / zoom) * scaleX;
        const actualCropHeight = (height / zoom) * scaleY;
        const actualX = (x / zoom) * scaleX;
        const actualY = (y / zoom) * scaleY;
        // Ensure the crop area is within the image boundaries
        const cropX = Math.max(0, Math.min(actualX, metadata.width - actualCropWidth));
        const cropY = Math.max(0, Math.min(actualY, metadata.height - actualCropHeight));
        const cropWidth = Math.min(actualCropWidth, metadata.width - cropX);
        const cropHeight = Math.min(actualCropHeight, metadata.height - cropY);
        if (cropWidth <= 0 || cropHeight <= 0) {
            return res.status(400).json({ message: 'Invalid crop dimensions' });
        }
        // Crop the image
        const croppedImage = image.extract({
            left: Math.round(cropX),
            top: Math.round(cropY),
            width: Math.round(cropWidth),
            height: Math.round(cropHeight),
        });
        // Save the cropped image
        yield croppedImage.toFile(croppedImagePath);
        // Generate a preview image
        const croppedBuffer = yield croppedImage.toBuffer();
        fs_1.default.writeFileSync(originalImagePath, croppedBuffer);
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
