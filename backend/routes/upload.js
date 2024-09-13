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
const router = express_1.default.Router();
// Configure multer to handle image uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Helper function to save images
const saveImage = (buffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(buffer)
        .resize(800) // Resize image for preview (low-quality)
        .jpeg({ quality: 60 }) // Lower quality for speed
        .toFile(filePath);
});
// POST /api/upload - Handle image uploads
router.post("/", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded!" });
    }
    const imagePath = path_1.default.join(__dirname, "../uploads", `${Date.now()}.jpeg`);
    try {
        yield saveImage(req.file.buffer, imagePath);
        const previewUrl = `${path_1.default.basename(imagePath)}`;
        // Send success response
        res.status(200).json({ previewUrl, message: "Image uploaded successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
