import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import userModel from "../../models/userModel.js";

async function userSignUpController(req, res) {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validate required fields
    if (!email || !phone || !address || !password || !name) {
      throw new Error("Please provide all required fields");
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Error in password encryption");
    }

    // Generate OTP and set expiration time
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create new user payload with hashed password, OTP, and expiration time
    const newUser = new userModel({
      email,
      password: hashPassword,
      name,
      phone,
      address,
      role: "user",
      otp,
      otpExpires,
      isEmailConfirmed: false, // Add flag for email confirmation
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Mail options for sending OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: savedUser.email,
      subject: "Your OTP Code",
      text: `Hi ${savedUser.name},\n\nYour OTP code is ${otp}. It will expire in 10 minutes.\n\nThank you!`,
    };

    // Send the email with OTP
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      data: savedUser,
      success: true,
      error: false,
      message:
        "User created successfully! An OTP has been sent to your email address.",
    });
  } catch (err) {
    console.error("Error:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export default userSignUpController;
