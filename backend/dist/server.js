"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Serve static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, "../", "uploads")));
app.use('/exports', express_1.default.static(path_1.default.join(__dirname, "../", "exports")));
// Use the image manipulation routes
app.use('/api/upload', routes_1.uploadRoutes);
app.use('/api/brightness', routes_1.brightnessRoutes);
app.use('/api/contrast', routes_1.contrastRoutes);
app.use("/api/saturation", routes_1.saturationRoutes);
app.use('/api/rotation', routes_1.rotationRoutes);
app.use('/api/crop', routes_1.cropRoutes);
app.use('/api/download', routes_1.downloadRoutes);
app.use('/api/reset', routes_1.resetRoutes);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
