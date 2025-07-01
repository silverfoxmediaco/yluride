// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const vanRoutes = require('./routes/vanRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vans', vanRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YLU Ride API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Check if build folder exists
  const buildPath = path.join(__dirname, '..', 'frontend', 'build');
  const fs = require('fs');
  
  if (fs.existsSync(buildPath)) {
    // Serve static files from the React frontend app
    app.use(express.static(buildPath));

    // Anything that doesn't match the above, send back React's index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    // If no build folder, serve a simple message
    app.get('*', (req, res) => {
      res.send(`
        <html>
          <head>
            <title>YLU Ride - Coming Soon</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              h1 {
                color: #333;
              }
              p {
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>YLU Ride</h1>
              <p>Luxury Van Rental Service</p>
              <p>Website coming soon...</p>
              <p><small>API Status: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}</small></p>
            </div>
          </body>
        </html>
      `);
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// MongoDB connection - OPTIONAL
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Running without database - Frontend only mode');
  });

  // Handle MongoDB connection errors after initial connection
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });
} else {
  console.log('No MongoDB URI provided - Running in frontend-only mode');
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!MONGODB_URI) {
    console.log('Running without database connection');
  }
});