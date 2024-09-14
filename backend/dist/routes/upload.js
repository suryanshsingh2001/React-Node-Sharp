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
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Configure multer to handle image uploads (stored in memory)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Define file paths for original and preview images
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
const originalImagePath = path_1.default.join(uploadsDir, "original.jpeg");
const previewImagePath = path_1.default.join(uploadsDir, "preview.jpeg");
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
// Helper function to save high-quality images
const saveOriginalImage = (buffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(buffer).jpeg({ quality: 100 }).toFile(filePath);
});
// Helper function to save low-res preview images
const savePreviewImage = (buffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(buffer)
        .resize(800) // Resize for preview (low-quality)
        .jpeg({ quality: 60 }) // Lower quality for quick loading
        .toFile(filePath);
});
// POST /api/upload - Handle image uploads
router.post("/", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded!" });
    }
    try {
        // Save both original and preview images
        yield saveOriginalImage(req.file.buffer, originalImagePath);
        yield savePreviewImage(req.file.buffer, previewImagePath);
        const previewUrl = `preview-image.jpeg`;
        // Send response with preview URL
        res.status(200).json({
            previewUrl,
            message: "Image uploaded successfully",
        });
    }
    catch (error) {
        console.error("Error saving images:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
