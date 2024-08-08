import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel.js";

export const autoCreateAdmin = async () => {
  const adminEmail = "Admin@admin.com";
  const existingAdmin = await UserModel.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminUser = new UserModel({
      name: "Admin",
      email: adminEmail,
      password: bcrypt.hashSync("Admin@123", 8), // hash the password
      address: "",
      phone: "",
      isAdmin: true,
    });

    await adminUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};
