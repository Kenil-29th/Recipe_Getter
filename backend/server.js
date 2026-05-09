require('dotenv').config();//loads .env file 
const express = require('express');//import express framework
const cors = require('cors');//import cors middleware
const path = require('path');
const connectDB = require('./config/db');//import db connection function
const { errorHandler, notFound } = require('./middleware/errorHandler');//import error handling middleware

// Route imports
const authRoutes = require('./routes/authRoutes');
const chefRoutes = require('./routes/chefRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Connect to MongoDB
connectDB();

const app = express();//initialize express app

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({//enables cors
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));//parse JSON Body max size 10mb
app.use(express.urlencoded({ extended: true, limit: '10mb' }));//parse url encoded data

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running.',
  });
});
// ─── Static Files (uploaded images) ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//Serve files from /uploads folder

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Recipe Suggestion API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);// all auth routes starts with api/routes
app.use('/api/chef', chefRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/contact', contactRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);//handle unknown routes
app.use(errorHandler);//handle all error

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;//set port
const server = app.listen(PORT, () => {//start serverr
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {//stop accepting new request
    console.log('Process terminated.');
    process.exit(0);//exit process successfully
  });
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;