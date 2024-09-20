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
    resetpasswordOTP: { type: String },
    isEmailConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
