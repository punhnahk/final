import userModel from "../../models/userModel.js";

const verifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is correct and has not expired
    if (
      user.passwordResetOTP === otp &&
      user.passwordResetExpires > Date.now()
    ) {
      user.password = newPassword; // Hashing should be done before saving
      user.passwordResetOTP = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } else {
      res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
export default verifyOTP;
