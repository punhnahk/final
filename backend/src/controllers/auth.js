import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import PasswordReset from "../models/passwordReset.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";
import dayjs from "dayjs";

const AuthController = {
  signUp: async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
      const emailOrPhoneExists = await User.findOne({
        $or: [{ email }, { phone }],
      }).exec();

      if (emailOrPhoneExists) {
        return res.status(400).json({
          message: "Email or phone exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userCount = await User.countDocuments();
      const role = userCount > 0 ? "USER" : "ADMIN";

      await new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
      }).save();

      res.status(201).json({
        status: true,
        message: "Register successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      // check email registered
      const findUser = await User.findOne({ email }).exec();

      if (!findUser) {
        return res.status(404).json({ message: "Unregistered account!" });
      }

      // check password
      const isPasswordValid = await bcrypt.compare(password, findUser.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Wrong password!" });
      }

      const token = jwt.sign(
        {
          id: findUser._id,
          email: findUser.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.json({
        user: findUser,
        token,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const expireMinutes = 15;
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpires = new Date(Date.now() + expireMinutes * 60 * 1000);

      const passwordReset = await PasswordReset.findOne({ email }).exec();

      if (passwordReset) {
        passwordReset.otp = otp;
        passwordReset.expired = otpExpires;
        await passwordReset.save();
      } else {
        await new PasswordReset({
          email,
          otp,
          expired: otpExpires,
        }).save();
      }

      await sendMail({
        toEmail: email,
        title: "Password Reset OTP",
        content: `Your OTP for password reset is: ${otp}. It is valid for ${expireMinutes} minutes.`,
      });

      res.json({
        success: true,
        message: "OTP sent to your email",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      const passwordReset = await PasswordReset.findOne({ email, otp }).exec();

      if (!passwordReset) {
        return res.status(404).json({
          message: "Invalid OTP",
        });
      }

      const isExpired = dayjs(passwordReset.expired).diff(dayjs()) <= 0;
      if (isExpired) {
        return res.status(400).json({
          message: "OTP has expired",
        });
      }

      // change password
      if (!newPassword) {
        return res.status(400).json({
          message: "Password is required",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      await PasswordReset.findOneAndDelete({ email });

      res.json({
        success: true,
        message: "Change password successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default AuthController;
