import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV];

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

// DDoS Protection with Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests before slowing down
  delayMs: 500, // Add 500ms delay per request after reaching the limit
});

app.use(limiter);
app.use(speedLimiter);

// Routes
app.use("/api", router);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
