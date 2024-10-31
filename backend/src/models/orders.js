import { model, Schema } from "mongoose";

export const STATUS_ORDER = [
  "INITIAL",
  "CONFIRMED",
  "DELIVERING",
  "DELIVERED",
  "CANCELED",
];

export const PAYMENT_STATUS = ["PAID", "UNPAID"];

export const PAYMENT_METHOD = {
  COD: "COD",
  VNPAY: "VNPAY",
};

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: Object,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: STATUS_ORDER,
      default: "INITIAL",
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "UNPAID",
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },
    voucherCode: {
      type: String,
      default: "", // Optional voucher code
    },
    discountAmount: {
      type: Number,
      default: 0, // Discount amount based on the voucher
    },
  },
  { timestamps: true }
);

const Order = model("orders", orderSchema);
export default Order;
