import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db/db.js";

import cloudinary from "./config/cloudinary/cloudinaryConfig.js";
import ProductRouter from "./routers/ProductRouter.js";
import UserRouter from "./routers/UserRouter.js";

import { createServer } from "http";
import { autoCreateAdmin } from "./controllers/AutoCreateAdmin.js";
dotenv.config();
process.env.TOKEN_SECRET;

const app = express();
const PORT = process.env.PORT || 4000;
const server = createServer(app);

connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/products", ProductRouter);
app.use("/user", UserRouter);

app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    res.json({ msg: "yaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  autoCreateAdmin(); // Call the function here
});
