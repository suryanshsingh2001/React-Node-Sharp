import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload';
import brightnessRoutes from './routes/brightness';
import contrastRoutes from './routes/contrast';
import rotationRoutes from './routes/rotation';
import cropRoutes from './routes/crop';
import convertRoutes from './routes/convert';
import path from 'path';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the image manipulation routes
app.use('/api/upload', uploadRoutes);
app.use('/api/brightness', brightnessRoutes);
app.use('/api/contrast', contrastRoutes);
app.use('/api/rotate', rotationRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/convert', convertRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
