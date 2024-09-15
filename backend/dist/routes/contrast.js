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
const originalImagePath = path_1.default.resolve(process.cwd(), "uploads", "original.jpeg");
const previewImagePath = path_1.default.resolve(process.cwd(), "uploads", "preview.jpeg");
// Helper function to save preview image
const savePreviewImage = (imageBuffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .resize(800) // Low-res for preview
        .jpeg({ quality: 80 }) // Lower quality for speed
        .toFile(filePath);
});
// POST /api/contrast - Adjust image contrast and return a preview
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contrast = 100, brightness = 100, saturation = 100 } = req.body;
    console.log(`Adjusting contrast to: ${contrast}`);
    try {
        // Load the original image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        let image = (0, sharp_1.default)(imageBuffer);
        // Apply contrast adjustment
        const adjustedContrast = contrast / 100;
        image = image.modulate({
            brightness: brightness / 100, // Keep brightness unchanged
            saturation: saturation / 100, // Keep saturation unchanged
        }).linear(adjustedContrast, // Adjust contrast
        -(128 * (adjustedContrast - 1)) // Maintain mid-tones
        );
        // Generate and save the preview image
        const previewBuffer = yield image.toBuffer();
        yield savePreviewImage(previewBuffer, previewImagePath);
        // Respond with preview URL
        res.json({
            previewUrl: `${path_1.default.basename(previewImagePath)}?t=${Date.now()}`,
        });
    }
    catch (error) {
        console.error("Error adjusting contrast:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
