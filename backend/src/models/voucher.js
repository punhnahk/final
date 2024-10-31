import { model, Schema } from "mongoose";

const voucherSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Voucher = model("vouchers", voucherSchema);
export default Voucher;
