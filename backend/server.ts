import express from 'express';
import cors from 'cors'; // Import CORS middleware
import path from 'path';
import uploadRoute from './routes/upload';
import processRoute from './routes/process';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to handle JSON body
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/upload', uploadRoute);
app.use('/api/process', processRoute);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
