import { model, Schema } from "mongoose";

const passwordResetSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expired: {
    type: Date,
    required: true,
  },
});

const PasswordReset = model("passwordResets", passwordResetSchema);
export default PasswordReset;
