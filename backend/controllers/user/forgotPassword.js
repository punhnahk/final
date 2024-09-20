import crypto from "crypto";
import nodemailer from "nodemailer"; // Import Nodemailer for sending emails
import userModel from "../../models/userModel.js"; // Import your user model

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save the OTP and expiry time to the user document
    user.resetpasswordOTP = otp;
    console.log(user.resetpasswordOTP);
    user.otpExpires = otpExpires; // OTP expires in 10 minutes
    console.log(user.otpExpires);
    await user.save();

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any other email provider
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error sending email" });
  }
};

export default forgotPassword;
