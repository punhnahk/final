import express from "express";
import userDetailsController from "../controllers/user/userDetails.js";
import userSigninController from "../controllers/user/userSignin.js";
import userSignupController from "../controllers/user/userSignup.js";
import authToken from "../Middleware/authToken";
const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailsController);

export default router;
