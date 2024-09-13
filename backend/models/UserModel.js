import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "user" },
    otp: { type: String },
    otpExpires: { type: Date },
    isEmailConfirmed: { type: Boolean, default: false },
    passwordResetOTP: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
