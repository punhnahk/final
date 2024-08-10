import bcrypt from "bcryptjs";
import userModel from "../../models/userModel.js";

async function userSignupController(req, res) {
  try {
    const { email, password, name, address, phone } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error(`User ${user.email} already exists`);
    }
    if (!email) {
      throw new Error("Please enter your email address");
    }
    if (!password) {
      throw new Error("Please enter your password");
    }
    if (!name) {
      throw new Error("Please enter your name");
    }
    if (!phone) {
      throw new Error("Please enter your phone");
    }
    if (!address) {
      throw new Error("Please enter your address");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Failed to hash password");
    }
    const payload = {
      ...req.body,
      role: "USER",
      password: hashPassword,
    };
    const userData = new userModel(payload);
    const saveUser = await userData.save();
    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User registered successfully",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default userSignupController;
