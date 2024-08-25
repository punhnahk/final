import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from "../../models/userModel.js";

async function userSignUpController(req, res) {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validate the required fields
    if (!email) throw new Error("Please provide an email");
    if (!phone) throw new Error("Please provide a phone number");
    if (!address) throw new Error("Please provide an address");
    if (!password) throw new Error("Please provide a password");
    if (!name) throw new Error("Please provide a name");

    // Check if user already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists.",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something is wrong");
    }

    const payload = {
      ...req.body,
      role: "user",
      password: hashPassword,
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    // Generate Email Confirmation Token
    const token = jwt.sign(
      { _id: saveUser._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // URL to be sent in the email
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: saveUser.email,
      subject: "Confirm Your Email",
      text: `Hi ${saveUser.name},\n\nPlease confirm your email by clicking the following link: ${confirmationUrl}\n\nThank you!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message:
        "User created successfully! A confirmation email has been sent to your email address.",
    });
  } catch (err) {
    console.error("Error in userSignUpController:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export default userSignUpController;
