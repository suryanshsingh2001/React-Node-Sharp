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
const utils_1 = require("../lib/utils");
const router = express_1.default.Router();
const originalImagePath = path_1.default.resolve(process.cwd(), "uploads", "original.jpeg");
const previewImagePath = path_1.default.resolve(process.cwd(), "uploads", "preview.jpeg");
// POST /api/rotate - Rotate the image, apply brightness, contrast, and saturation, and return a preview
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rotation, brightness = 100, contrast = 100, saturation = 100, } = req.body;
    try {
        // Read the original high-quality image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        let image = (0, sharp_1.default)(imageBuffer);
        // Apply brightness, contrast, and saturation adjustments using `modulate`
        const adjustedBrightness = brightness / 100; // 1.0 means no change
        const adjustedSaturation = saturation / 100; // 1.0 means no change
        const adjustedContrast = contrast / 100; // 1.0 means no change
        // Apply adjustments only if they differ from 100
        image = image
            .modulate({
            brightness: adjustedBrightness,
            saturation: adjustedSaturation,
        })
            .linear(adjustedContrast, -(128 * (adjustedContrast - 1)))
            .rotate(rotation, { background: { r: 255, g: 255, b: 255, alpha: 1 } });
        // Generate a preview of the adjusted and rotated image
        const rotatedBuffer = yield image.toBuffer();
        yield (0, utils_1.savePreviewImage)(rotatedBuffer, previewImagePath); // Create a preview version
        // Send the preview URL with a cache-busting timestamp
        res.json({
            previewUrl: `${path_1.default.basename(previewImagePath)}?t=${Date.now()}`,
        });
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
