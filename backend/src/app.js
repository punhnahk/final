import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
    credentials: true,
  },
});

const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV];

// Middleware
app.use(helmet());
app.use(compression());
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

// DDoS Protection with Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Routes
app.use("/api", router);

// Socket.IO event for connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io }; // Export io to use in controllers
