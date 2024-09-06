import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routers/index.js";

import connectDB from "./config/db/db.js";
import autoCreateAdmin from "./Middleware/AutoCreateAdmin.js";
const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api", router);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  autoCreateAdmin();
});
