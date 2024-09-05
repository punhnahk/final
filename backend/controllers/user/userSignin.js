import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../../models/userModel.js";

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }

    // Fetch user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
      return res.status(403).json({
        message: "Please confirm your email before logging in.",
        success: false,
        error: true,
      });
    }

    // Check password validity
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new Error("Incorrect password");
    }

    // Create token payload
    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    // Sign the token with a secret key
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 8, // 8 hours expiration
    });

    const tokenOption = {
      httpOnly: true,
      secure: true,
    };

    // Set token in HTTP-only cookie
    res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successfully",
      data: token,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default userSignInController;
