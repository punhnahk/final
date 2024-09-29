import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

import router from "./routes/index.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
  })
);

// connect db
connectDB();

// router
app.use("/api", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
