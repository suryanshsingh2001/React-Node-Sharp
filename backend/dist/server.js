"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const upload_1 = __importDefault(require("./routes/upload"));
const brightness_1 = __importDefault(require("./routes/brightness"));
const contrast_1 = __importDefault(require("./routes/contrast"));
const rotation_1 = __importDefault(require("./routes/rotation"));
const crop_1 = __importDefault(require("./routes/crop"));
const saturation_1 = __importDefault(require("./routes/saturation"));
const download_1 = __importDefault(require("./routes/download"));
const reset_1 = __importDefault(require("./routes/reset"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Serve static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, "../", "uploads")));
app.use('/exports', express_1.default.static(path_1.default.join(__dirname, "../", "exports")));
// Use the image manipulation routes
app.use('/api/upload', upload_1.default);
app.use('/api/brightness', brightness_1.default);
app.use('/api/contrast', contrast_1.default);
app.use("/api/saturation", saturation_1.default);
app.use('/api/rotation', rotation_1.default);
app.use('/api/crop', crop_1.default);
app.use('/api/download', download_1.default);
app.use('/api/reset', reset_1.default);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
