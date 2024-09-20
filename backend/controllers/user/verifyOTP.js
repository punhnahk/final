import bcrypt from "bcryptjs";
import userModel from "../../models/userModel.js";

async function verifyOTP(req, res) {
  try {
    const { email, otp, newPassword } = req.body; // Updated newPassword
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    // Check if the OTP is correct and not expired
    if (user.resetpasswordOTP === otp && user.otpExpires > Date.now()) {
      // Ensure correct OTP field
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(newPassword, salt);
      user.password = hashPassword;
      user.resetpasswordOTP = undefined;
      user.otpExpires = undefined;
      await user.save();

      return res.status(200).json({
        message: "Password changed successfully!",
        success: true,
        error: false,
      });
    } else {
      return res.status(400).json({
        message: "Invalid or expired OTP.",
        success: false,
        error: true,
      });
    }
  } catch (err) {
    console.error("Error:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export default verifyOTP;
