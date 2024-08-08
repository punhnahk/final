import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db/db.js";

import ProductRouter from "./routers/ProductRouter.js";
import UserRouter from "./routers/UserRouter.js";

import { createServer } from "http";
import { autoCreateAdmin } from "./controllers/AutoCreateAdmin.js";
dotenv.config();
process.env.TOKEN_SECRET;

const app = express();
const PORT = process.env.PORT || 8000;
const server = createServer(app);

connectDB();

app.use(cors());


app.use("/products", ProductRouter);
app.use("/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  autoCreateAdmin(); // Call the function here
});
