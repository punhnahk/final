import bcrypt from "bcrypt";
import User from "../models/user.js";

const UserController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find().sort("-createdAt").exec();

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).exec();

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).exec();

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, avatar, address, gender, birthday, role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        {
          name,
          avatar,
          address,
          gender,
          birthday,
          role,
        },
        { new: true }
      ).exec();

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, avatar, address, gender, birthday, phone } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          name,
          avatar,
          address,
          gender,
          birthday,
          phone,
        },
        { new: true }
      ).exec();

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  changeProfilePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { password, newPassword } = req.body;

      const findUser = await User.findById(userId).exec();
      if (!findUser) {
        return res.status(404).json({
          message: "User not found!",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, findUser.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password incorrect!" });
      }

      const isSameOldPassword = await bcrypt.compare(
        newPassword,
        findUser.password
      );
      if (isSameOldPassword) {
        return res
          .status(406)
          .json({ message: "New password does not same as old password" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
      }).exec();

      res.json({
        message: "Change password successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id).exec();

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  deactivateUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isActive = !user.isActive;

      await user.save();

      const message = user.isActive
        ? "User account activated successfully"
        : "User account deactivated successfully";

      res.json({ message });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default UserController;
