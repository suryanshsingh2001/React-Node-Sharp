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
const utils_1 = require("../lib/utils");
const router = express_1.default.Router();
// Configure multer for image uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Dynamic file paths (without hardcoding the extension)
const originalImagePath = path_1.default.resolve(process.cwd(), "uploads", `original.jpeg`);
const previewImagePath = path_1.default.resolve(process.cwd(), "uploads", `preview.jpeg`);
// POST /api/upload - Handle image uploads and dynamically detect format
router.post("/", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded!" });
    }
    try {
        // Use sharp to detect the format of the uploaded image
        const image = (0, sharp_1.default)(req.file.buffer);
        // Save the original image
        yield image.toFile(originalImagePath);
        // Save the preview image
        yield (0, utils_1.savePreviewImage)(req.file.buffer, previewImagePath);
        const previewUrl = `${path_1.default.basename(previewImagePath)}?t=${Date.now()}`;
        res
            .status(200)
            .json({ previewUrl, message: "Image uploaded successfully" });
    }
    catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
}));
exports.default = router;
