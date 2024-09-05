async function ensureEmailConfirmed(req, res, next) {
  const { email } = req.user; // Assuming req.user is populated with the logged-in user's info

  const user = await userModel.findOne({ email });

  if (user && user.isEmailConfirmed) {
    next(); // Allow access if email is confirmed
  } else {
    return res.status(403).json({
      message: "Please confirm your email to access this resource.",
      success: false,
      error: true,
    });
  }
}

export default ensureEmailConfirmed;
