import userModel from "../../models/userModel.js";

async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    // Check if the OTP is correct and not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      // Update the user's email confirmation status
      user.isEmailConfirmed = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      return res.status(200).json({
        message: "Email confirmed successfully!",
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

export default verifyOtpController;
