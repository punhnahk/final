import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
  try {
    // Retrieve token from cookies
    const token = req.cookies?.token;

    console.log("token", token);

    // If no token, send a response prompting the user to log in
    if (!token) {
      return res.status(401).json({
        message: "Authentication failed. Please login.",
        error: true,
        success: false,
      });
    }

    // Verify the token using JWT and your secret key
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      if (err) {
        // Handle invalid or expired token errors
        console.error("JWT verification error:", err);
        return res.status(403).json({
          message: "Invalid or expired token. Please login again.",
          error: true,
          success: false,
        });
      }

      // Assign the userId from the decoded token to req.userId
      req.userId = decoded?._id;

      if (!req.userId) {
        return res.status(400).json({
          message: "Token is invalid. User ID not found.",
          error: true,
          success: false,
        });
      }

      // If all is well, proceed to the next middleware
      next();
    });
  } catch (err) {
    // Handle any unexpected errors during the token verification process
    console.error("Unexpected error in authToken:", err);
    return res.status(500).json({
      message: err.message || "Internal server error during authentication.",
      error: true,
      success: false,
    });
  }
}

export default authToken;
