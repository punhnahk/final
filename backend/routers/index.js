import express from "express";
import userDetailsController from "../controllers/user/userDetails.js";
import userLogoutController from "../controllers/user/userLogout.js";
import userSigninController from "../controllers/user/userSignin.js";
import userSignupController from "../controllers/user/userSignup.js";
import authToken from "../Middleware/authToken.js";
const router = express.Router();

router.post("/signup", userSignupController);
router.post("/signin", userSigninController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogoutController);

export default router;
