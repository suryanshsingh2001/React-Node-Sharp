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
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
const exportDir = path_1.default.resolve(process.cwd(), "exports");
// Ensure the export directory exists
if (!fs_1.default.existsSync(exportDir)) {
    fs_1.default.mkdirSync(exportDir);
}
// POST /api/export - Apply changes and export the high-quality image
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { format, brightness, contrast, saturation, rotation } = req.body; // Image parameters
        const imageBuffer = fs_1.default.readFileSync(path_1.default.join(uploadsDir, "original.jpeg"));
        // Apply all modifications
        let modifiedImage = (0, sharp_1.default)(imageBuffer);
        // Adjust brightness, contrast, and saturation if necessary
        if (brightness || contrast || saturation) {
            if (brightness || saturation) {
                modifiedImage = modifiedImage.modulate({
                    brightness: brightness ? brightness / 100 : 1, // Default is 100%
                    saturation: saturation ? saturation / 100 : 1, // Default is 100%
                });
            }
            if (contrast) {
                modifiedImage = modifiedImage.linear(contrast / 100, 0); // Adjust contrast
            }
        }
        // Apply rotation if needed
        if (rotation) {
            modifiedImage = modifiedImage.rotate(rotation);
        }
        // Convert to the requested format and export
        const convertedImage = yield modifiedImage.toFormat(format).toBuffer();
        // Save the high-quality image to the export directory
        const exportPath = path_1.default.join(exportDir, `exported_image.${format}`);
        fs_1.default.writeFileSync(exportPath, convertedImage);
        // Send the preview URL for the frontend to download the image
        console.log("Image exported successfully", exportPath);
        res.status(200).json({ url: `${path_1.default.basename(exportPath)}` });
    }
    catch (error) {
        console.error("Error exporting image:", error);
        res.status(500).json({ message: "Error exporting image" });
    }
}));
exports.default = router;
