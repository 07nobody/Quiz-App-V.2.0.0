const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const cors = require("cors");

// Enable CORS with broader settings to fix connection issues
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");
const paymentsRoute = require("./routes/paymentsRoute");
const flashcardsRoute = require("./routes/flashcardsRoute");
const decksRoute = require("./routes/decksRoute");
const settingsRoute = require("./routes/settingsRoute");

// Register routes
app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/flashcards", flashcardsRoute);
app.use("/api/decks", decksRoute);
app.use("/api/settings", settingsRoute);

// 404 handler for unmatched routes
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Initialize settings - explicitly wait for settings to be initialized
const Setting = require("./models/settingModel");
(async () => {
  try {
    await Setting.initializeDefaultSettings();
    console.log('Settings initialization completed');
  } catch (error) {
    console.error('Failed to initialize settings:', error);
  }
})();

const port = process.env.PORT || 5000;
const alternativePorts = [5001, 5002, 5003, 5004];

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`Server listening on port ${portToUse}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToUse} is busy, trying alternative port...`);
      if (alternativePorts.length > 0) {
        startServer(alternativePorts.shift());
      } else {
        console.error('All ports are busy. Please close some applications and try again.');
        process.exit(1);
      }
    } else {
      console.error('Error starting server:', err);
      process.exit(1);
    }
  });
};

startServer(port);
