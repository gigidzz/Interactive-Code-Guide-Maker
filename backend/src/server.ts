import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import codeGuideRoutes from './routes/codeGuide';
import userRoutes from './routes/users';
import { errorHandler } from './middleware';
import { AuthService } from './services/authServices';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/code-guides', codeGuideRoutes);
app.use('/api/users', userRoutes);


app.use(errorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

setInterval(async () => {
  try {
    await AuthService.cleanupExpiredTempData();
    console.log('Expired temp data cleaned up');
  } catch (error) {
    console.error('Error cleaning up expired temp data:', error);
  }
}, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📡 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
📊 Health check: http://localhost:${PORT}/health
  `);
});

export default app;