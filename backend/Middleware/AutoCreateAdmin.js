import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

const autoCreateAdmin = async () => {
  const adminEmail = "Admin@admin.com";
  const existingAdmin = await UserModel.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminUser = new UserModel({
      name: "Admin",
      email: adminEmail,
      password: bcrypt.hashSync("Admin@123", 8), // hash the password
      address: "ADMIN",
      phone: "1234567890",
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};
export default autoCreateAdmin;
