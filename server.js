require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Simple root route to confirm the API is running
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management API is running',
  });
});

// Mount user routes
app.use('/api/users', userRoutes);

// 404 handler — for any route that doesn't match
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler — catches any unexpected errors (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// Connect to the database, sync models, then start the server
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync(); // creates the users table if it doesn't already exist
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
