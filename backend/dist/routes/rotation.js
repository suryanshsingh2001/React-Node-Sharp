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
const imagePath = path_1.default.resolve(process.cwd(), "uploads", `original.jpeg`);
const previewPath = path_1.default.resolve(process.cwd(), "uploads", `preview.jpeg`);
// POST /api/rotate - Rotate the image and delete the previous version
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rotation } = req.body;
    try {
        // Check if a previous preview image exists and delete it
        // if (fs.existsSync(previewPath)) {
        //   fs.unlinkSync(previewPath);
        // }
        const imageBuffer = fs_1.default.readFileSync(imagePath);
        const image = (0, sharp_1.default)(imageBuffer).rotate(rotation);
        const previewBuffer = yield image
            .resize(800)
            .jpeg({ quality: 60 })
            .toBuffer();
        fs_1.default.writeFileSync(previewPath, previewBuffer);
        // Append a cache-busting query string (timestamp)
        res.json({ previewUrl: `${path_1.default.basename(previewPath)}?t=${Date.now()}` });
    }
    catch (error) {
        res.status(500).json({ message: "Error rotating image" });
    }
}));
exports.default = router;
