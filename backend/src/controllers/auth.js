import bcrypt from "bcrypt";
import crypto from "crypto";
import dayjs from "dayjs";
import { OAuth2Client } from "google-auth-library"; // Import Google OAuth client
import Joi from "joi"; // Import Joi
import jwt from "jsonwebtoken";
import PasswordReset from "../models/passwordReset.js";
import User from "../models/user.js";
import sendMail from "../utils/sendMail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize Google client

const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).required(),
});

const googleSignUpSchema = Joi.object({
  token: Joi.string().required(),
});

const AuthController = {
  signUp: async (req, res) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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
      const newUser = await new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        loginMethod: "password",
      }).save();

      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.status(201).json({
        status: true,
        message: "Register successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          loginMethod: newUser.loginMethod,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  signIn: async (req, res) => {
    const { error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
      const findUser = await User.findOne({ email }).exec();

      if (!findUser) {
        return res.status(404).json({ message: "Unregistered account!" });
      }

      if (!findUser.isActive) {
        return res.status(403).json({
          message: "Your account has been deactivated. Please contact support.",
        });
      }

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
        user: {
          id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          phone: findUser.phone,
          role: findUser.role,
        },
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
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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
        content: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #ffffff; padding: 20px;">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <h2 style="color: #4CAF50;">Password Reset Request</h2>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; line-height: 1.6; padding-bottom: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Your One-Time Password (OTP) for resetting your password is:</p>
              <h3 style="font-size: 24px; color: #4CAF50;">${otp}</h3>
              <p>This OTP is valid for ${expireMinutes} minutes. Please use it before it expires.</p>
            </td>
          </tr>
          <tr>
            <td style="font-size: 14px; line-height: 1.6; color: #777;">
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p>Best regards,</p>
              <p>Noel Techshop</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
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
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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

  googleSignUp: async (req, res) => {
    const { error } = googleSignUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { name, email, picture } = ticket.getPayload();

      let user = await User.findOne({ email }).exec();

      if (!user) {
        user = new User({
          name,
          email,
          avatar: picture,
          phone: "",
          password: "", // No password needed for social login
          loginMethod: "google", // Set login method to google
        });
        await user.save();
      }

      const jwtToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          loginMethod: user.loginMethod,
        },
        token: jwtToken,
      });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({
        message: "Google login failed",
        error: error.message,
      });
    }
  },
};

export default AuthController;
