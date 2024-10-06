import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io"; // Import Socket.IO
import connectDB from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL, // Add any other allowed origins here
];

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Connect to the database
connectDB();

// Set up Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Example event listener
  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Broadcast to all clients
    io.emit("message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Routes
app.use("/api", router);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
