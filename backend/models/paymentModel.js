import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  totalPay: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
