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
exports.clearAllFilesInFolder = exports.savePreviewImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const savePreviewImage = (imageBuffer, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, sharp_1.default)(imageBuffer)
        .resize(800) // Resize for preview (low-quality)
        .jpeg({ quality: 80 }) // Lower quality for preview
        .toFile(filePath);
});
exports.savePreviewImage = savePreviewImage;
const clearAllFilesInFolder = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(folderPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const deletePromises = files.map((file) => {
                const filePath = path_1.default.join(folderPath, file);
                return new Promise((res, rej) => {
                    fs_1.default.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            return rej(unlinkErr);
                        }
                        res();
                    });
                });
            });
            Promise.all(deletePromises)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
};
exports.clearAllFilesInFolder = clearAllFilesInFolder;
