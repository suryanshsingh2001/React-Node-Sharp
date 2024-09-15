import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload';
import brightnessRoutes from './routes/brightness';
import contrastRoutes from './routes/contrast';
import rotationRoutes from './routes/rotation';
import cropRoutes from './routes/crop';
import saturationRoutes from './routes/saturation';
import downloadRoutes from './routes/download';
import resetRoutes from './routes/reset';
import path from 'path';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files


app.use('/uploads', express.static(path.join(__dirname, "../", "uploads")));
app.use('/exports', express.static(path.join(__dirname, "../", "exports")));

// Use the image manipulation routes
app.use('/api/upload', uploadRoutes); 
app.use('/api/brightness', brightnessRoutes); 
app.use('/api/contrast', contrastRoutes); 
app.use("/api/saturation", saturationRoutes) 
app.use('/api/rotation', rotationRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/reset', resetRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

