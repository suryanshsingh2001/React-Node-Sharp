"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import CORS middleware
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("./routes/upload"));
const process_1 = __importDefault(require("./routes/process"));
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Middleware to handle JSON body
app.use(express_1.default.json());
// Serve static files (uploaded images)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use('/api/upload', upload_1.default);
app.use('/api/process', process_1.default);
// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
