import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import paymentRoutes from './routes/payments.js';
import attendanceRoutes from './routes/attendance.js';
import noticeRoutes from './routes/notices.js';

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Current Directory Fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notices', noticeRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Student Management API is running',
  });
});

// Serve Frontend in Production
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

// React Router Support
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack:
      process.env.NODE_ENV === 'production'
        ? null
        : err.stack,
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});