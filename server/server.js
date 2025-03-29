const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Configure CORS with WebSocket support
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 3600, // Cache preflight requests for 1 hour
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ]
}));

app.use(express.json());

const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const resportsRoute = require("./routes/reportsRoute");
const paymentsRoute = require("./routes/paymentsRoute");

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'Something went wrong!',
    success: false,
    error: err.message
  });
});

app.get("/", (req, res) => {
  res.send("Server is running. Use /api endpoints to access the quiz application API.");
});

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", resportsRoute);
app.use("/api/payments", paymentsRoute);

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
}

const startServer = async (retryCount = 0) => {
  const port = process.env.PORT || 5000 + retryCount;
  
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        resolve();
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && retryCount < 10) {
          console.log(`Port ${port} is in use, trying next port...`);
          server.close();
          startServer(retryCount + 1);
        } else {
          console.error('Failed to start server:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Server startup failed:', error);
  }
};

startServer();
