const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Global error logging middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  next(err);
});

// Error handling
app.use(errorHandler);

module.exports = app;