import jwt from "jsonwebtoken";
import userModel from "../../models/userModel.js";

async function emailConfirmationController(req, res) {
  try {
    const { token } = req.params; // Extract token from URL parameters

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        error: true,
        success: false,
      });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return res.status(400).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    if (!decodedToken || !decodedToken._id) {
      return res.status(400).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    // Find the user by ID and update confirmEmail
    const user = await userModel.findById(decodedToken._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.confirmEmail) {
      return res.status(400).json({
        message: "Email is already confirmed",
        error: true,
        success: false,
      });
    }

    user.confirmEmail = true; // Ensure field name matches your schema
    await user.save();

    res.status(200).json({
      message: "Email confirmed successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Error in confirmEmailController:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

export default emailConfirmationController;
