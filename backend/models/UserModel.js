import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    confirmEmail: { type: Boolean, default: false },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    password: String,
    profilePic: String,
    role: String,
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
