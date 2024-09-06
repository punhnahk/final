import userModel from "../../models/userModel.js";

async function allUser(req, res, next) {
  try {
    console.log("userid", req.userId);
    const allUser = await userModel.find();
    res.json({
      message: "All User",
      data: allUser,
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
export default allUser;
