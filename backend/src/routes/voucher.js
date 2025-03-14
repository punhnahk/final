import express from "express";
import VoucherController from "../controllers/voucher.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const voucherRouter = express.Router();

voucherRouter.post("/", checkLogin, isAdmin, VoucherController.createVoucher);
voucherRouter.get("/", VoucherController.getAllVouchers);
voucherRouter.get("/:id", checkLogin, VoucherController.getVoucher);
voucherRouter.put("/:id", checkLogin, isAdmin, VoucherController.updateVoucher);
voucherRouter.get(
  "/code/:code",
  checkLogin,
  VoucherController.getVoucherByCode
);
voucherRouter.delete(
  "/:id",
  checkLogin,
  isAdmin,
  VoucherController.deleteVoucher
);
voucherRouter.post("/send/:id", VoucherController.sendVoucher);
voucherRouter.post(
  "/delete-usage",
  checkLogin,
  VoucherController.deleteVoucherUsage
);

export default voucherRouter;
