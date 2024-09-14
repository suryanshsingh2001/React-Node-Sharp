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
// Directory for uploads
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
// Dynamic paths for the original and preview images
let originalImagePath = "";
let previewImagePath = "";
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
// Helper function to detect the image format and set the paths
const setImagePaths = (imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const image = (0, sharp_1.default)(imageBuffer);
    const metadata = yield image.metadata();
    const extension = metadata.format;
    // Set the paths based on the detected format
    originalImagePath = path_1.default.join(uploadsDir, `original.${extension}`);
    previewImagePath = path_1.default.join(uploadsDir, `preview.jpeg`); // Preview is always saved as JPEG
});
// Helper function to save the preview image
const savePreviewImage = (imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .resize(800) // Resize for preview (low-quality)
        .jpeg({ quality: 80 }) // Preview always as JPEG with lower quality
        .toFile(previewImagePath);
});
// POST /api/brightness - Adjust image brightness
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brightness } = req.body;
    console.log(`Adjusting brightness to: ${brightness}`);
    try {
        // Load the original image
        const imageBuffer = fs_1.default.readFileSync(originalImagePath);
        // Set the image paths dynamically if not already set (in case of first-time processing)
        if (!originalImagePath) {
            yield setImagePaths(imageBuffer);
        }
        // Create the sharp instance and adjust brightness
        let image = (0, sharp_1.default)(imageBuffer).modulate({ brightness: brightness / 100 });
        // Save the updated original image (overwrite the original)
        yield image.toFile(originalImagePath);
        // Generate and save the preview image
        const previewBuffer = yield image.clone().resize(800).jpeg({ quality: 80 }).toBuffer();
        fs_1.default.writeFileSync(previewImagePath, previewBuffer);
        // Return the preview URL with cache-busting
        res.json({ previewUrl: `${path_1.default.basename(previewImagePath)}?t=${Date.now()}` });
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
