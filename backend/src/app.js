import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV];

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Reduced limit
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  })
);

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
  max: 500, // Reduce max requests
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api", router);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
