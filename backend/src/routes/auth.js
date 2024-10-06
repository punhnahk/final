import express from "express";
import AuthController from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", AuthController.signUp);
authRouter.post("/login", AuthController.signIn);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);
authRouter.post("/google-signup", AuthController.googleSignUp);

export default authRouter;
