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
// POST /api/convert - Convert image format (e.g., PNG to JPEG)
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { format } = req.body; // e.g., 'jpeg', 'png'
        const imageBuffer = fs_1.default.readFileSync(path_1.default.join(__dirname, '../uploads', 'image.jpeg'));
        const convertedImage = yield (0, sharp_1.default)(imageBuffer)
            .toFormat(format)
            .toBuffer();
        const outputPath = path_1.default.join(__dirname, '../uploads', `${Date.now()}.${format}`);
        fs_1.default.writeFileSync(outputPath, convertedImage);
        res.json({ previewUrl: `${path_1.default.basename(outputPath)}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error converting image' });
    }
}));
exports.default = router;
