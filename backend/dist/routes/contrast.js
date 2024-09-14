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
        .jpeg({ quality: 60 }) // Lower quality for speed
        .toFile(filePath);
});
// POST /api/contrast - Adjust image contrast and return a preview
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contrast } = req.body;
    try {
        // Read original image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        // Adjust contrast using linear
        let image = (0, sharp_1.default)(imageBuffer).linear(contrast / 100, // Multiplier for contrast (1 = no change, >1 = more contrast, <1 = less contrast)
        -(128 * (contrast / 100 - 1)) // Brightness offset to maintain mid-tones
        );
        // Save the updated original image
        yield image.toFile(originalImagePath);
        // Generate and save the preview image
        yield savePreviewImage(yield image.toBuffer(), previewImagePath);
        // Respond with preview URL and cache-busting
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
