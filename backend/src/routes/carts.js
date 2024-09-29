import express from "express";
import { checkLogin } from "../middlewares/auth.js";
import CartController from "../controllers/carts.js";

const cartRouter = express.Router();

cartRouter.post("/", checkLogin, CartController.addCart);
cartRouter.get("/my-carts", checkLogin, CartController.getMyCarts);
cartRouter.delete("/:productId", checkLogin, CartController.deleteProduct);
cartRouter.put("/", checkLogin, CartController.updateQuantity);

export default cartRouter;
