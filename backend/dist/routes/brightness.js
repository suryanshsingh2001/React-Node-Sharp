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
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
const originalImagePath = path_1.default.join(uploadsDir, "original.jpeg");
const previewImagePath = path_1.default.join(uploadsDir, "preview.jpeg");
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
// Helper function to save preview images
const savePreviewImage = (imageBuffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .resize(800) // Resize for preview (low-quality)
        .jpeg({ quality: 80 }) // Lower quality for preview
        .toFile(filePath);
});
// POST /api/brightness - Adjust image brightness
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brightness } = req.body;
    console.log(`Adjusting brightness to: ${brightness}`);
    try {
        // Load the original image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        let image = (0, sharp_1.default)(imageBuffer);
        // Adjust brightness
        image = image.modulate({ brightness: brightness / 100 });
        // Save the updated original image
        yield image.toFile(originalImagePath); // Overwrite the original
        // Generate and save the preview image
        yield savePreviewImage(imageBuffer, previewImagePath);
        // Return the preview URL with cache-busting
        res.json({ previewUrl: `${path_1.default.basename(previewImagePath)}?t=${Date.now()}` });
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
