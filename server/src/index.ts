import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database';
import vocabularyRoutes from './routes/vocabulary';
import lessonRoutes from './routes/lessons';
import storyRoutes from './routes/stories';
import testRoutes from './routes/tests';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [/\.netlify\.app$/, /localhost:\d+$/]
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/tests', testRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
