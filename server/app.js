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
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

module.exports = app;