import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    password: String,
    profilePic: String,
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
