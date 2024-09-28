import express from "express";
import authRouter from "./auth.js";
import categoryRouter from "./categories.js";
import productRouter from "./products.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);

export default router;
