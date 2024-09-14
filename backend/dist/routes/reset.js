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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Dynamic file paths for the uploads folder
const uploadsFolder = path_1.default.resolve(process.cwd(), "uploads");
const exportsFolder = path_1.default.resolve(process.cwd(), "exports");
// Helper function to delete all files in the uploads folder
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
// GET /api/reset - Clears all images in the uploads folder
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the uploads folder exists
        if (fs_1.default.existsSync(uploadsFolder)) {
            yield clearAllFilesInFolder(uploadsFolder);
            yield clearAllFilesInFolder(exportsFolder);
            res.status(200).json({ message: "All images have been removed from uploads folder." });
        }
        else {
            res.status(400).json({ message: "Uploads folder does not exist." });
        }
    }
    catch (error) {
        console.error("Error clearing uploads folder:", error);
        res.status(500).json({ message: "Error clearing uploads folder." });
    }
}));
exports.default = router;
