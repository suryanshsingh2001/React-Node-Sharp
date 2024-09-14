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
const router = express_1.default.Router();
// Paths for original and preview images
const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
const originalImagePath = path_1.default.join(uploadsDir, 'original.jpeg'); // Ensure this is set correctly
const previewImagePath = path_1.default.join(uploadsDir, 'preview.jpeg');
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
// Helper function to save cropped images
const saveCroppedImage = (imageBuffer, cropData, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .extract({
        left: Math.round(cropData.x),
        top: Math.round(cropData.y),
        width: Math.round(cropData.width),
        height: Math.round(cropData.height),
    })
        .toFile(outputPath);
});
// POST /api/crop - Crop the image
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { x, y, width, height } = req.body;
    try {
        // Load the original image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        // Crop the image using the pixel dimensions provided
        yield saveCroppedImage(imageBuffer, { x, y, width, height }, previewImagePath);
        // Return the new preview URL
        res.json({ previewUrl: `preview.jpeg?t=${Date.now()}` });
    }
    catch (error) {
        console.error('Error cropping image:', error);
        res.status(500).json({ message: 'Error cropping image' });
    }
}));
exports.default = router;
