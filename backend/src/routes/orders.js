import express from "express";
import { checkLogin, isAdmin } from "../middlewares/auth.js";
import OrderController from "../controllers/orders.js";

const orderRouter = express.Router();

orderRouter.post("/", checkLogin, OrderController.createOrder);
orderRouter.get("/", checkLogin, isAdmin, OrderController.getAllOrders);
orderRouter.get("/my-orders", checkLogin, OrderController.getAllMyOrders);
orderRouter.get("/:id", checkLogin, OrderController.getOrder);
orderRouter.put("/:id", checkLogin, OrderController.updateStatus);

export default orderRouter;
