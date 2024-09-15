import express from 'express';
import cors from 'cors';

import {
  uploadRoutes,
  brightnessRoutes,
  contrastRoutes,
  saturationRoutes,
  rotationRoutes,
  cropRoutes,
  downloadRoutes,
  resetRoutes
} from './routes';


import path from 'path';

const app = express();



// Enable CORS and JSON parsing
app.use(express.json());
app.use(cors());




// Serve the uploads and export folder statically
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

