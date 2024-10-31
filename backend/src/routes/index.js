import express from "express";
import authRouter from "./auth.js";
import cartRouter from "./carts.js";
import categoryRouter from "./categories.js";
import CommentRouter from "./comments.js";
import orderRouter from "./orders.js";
import postCategoryRouter from "./postCategories.js";
import postRouter from "./posts.js";
import productRouter from "./products.js";
import sliderRouter from "./sliders.js";
import userRouter from "./users.js";
import voucherRouter from "./voucher.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/post-categories", postCategoryRouter);
router.use("/posts", postRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/sliders", sliderRouter);
router.use("/carts", cartRouter);
router.use("/orders", orderRouter);
router.use("/comments", CommentRouter);
router.use("/vouchers", voucherRouter);
export default router;
