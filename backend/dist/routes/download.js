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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { format } = req.body; // e.g., 'jpeg', 'png'
        const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
        const exportDir = path_1.default.resolve(process.cwd(), "exports");
        const imageBuffer = fs_1.default.readFileSync(path_1.default.join(uploadsDir, "original.jpeg"));
        const convertedImage = yield (0, sharp_1.default)(imageBuffer).toFormat(format).toBuffer();
        const exportPath = path_1.default.join(exportDir, `original.${format}`);
        fs_1.default.writeFileSync(exportPath, convertedImage);
        // Send the preview URL for the frontend to download
        console.log("Image converted successfully", exportPath);
        res.status(200).json({ previewUrl: path_1.default.basename(exportPath) });
    }
    catch (error) {
        res.status(500).json({ message: "Error converting image" });
    }
}));
exports.default = router;
