import express from "express";
import userSigninController from "../controllers/user/userSignin.js";
import userSignupController from "../controllers/user/userSignup.js";
const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);

export default router;
