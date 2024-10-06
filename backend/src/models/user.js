import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    address: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    loginMethod: {
      type: String,
      enum: ["password", "google"],
      default: "password",
    },
  },
  { timestamps: true }
);

const User = model("users", userSchema);
export default User;
