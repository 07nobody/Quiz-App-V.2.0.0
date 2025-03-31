const mongoose = require("mongoose");
require('dotenv').config({ path: './server/.env' });

if (!process.env.MONGO_URL) {
  console.error('MONGO_URL environment variable is not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB Connection Successful");
});

connection.on("error", (err) => {
  console.error("MongoDB Connection Failed:", err);
});

connection.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

process.on("SIGINT", async () => {
  await connection.close();
  process.exit(0);
});

module.exports = connection;
