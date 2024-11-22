import { model, Schema } from "mongoose";

const VoucherUsageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    voucherId: {
      type: Schema.Types.ObjectId,
      ref: "vouchers",
      required: true,
    },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VoucherUsage = model("VoucherUsage", VoucherUsageSchema);
export default VoucherUsage;
