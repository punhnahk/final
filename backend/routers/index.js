import express from "express";

import allUsers from "../controllers/admin/allUser.js";
import userDetailsController from "../controllers/admin/userDetails.js";
import updateUser from "../controllers/admin/userUpdate.js";
import addToCartController from "../controllers/cart/addToCartController.js";
import addToCartViewProduct from "../controllers/cart/addToCartViewProduct.js";
import countAddToCartProduct from "../controllers/cart/countAddToCartProduct.js";
import deleteAddToCartProduct from "../controllers/cart/deleteAddToCartProduct.js";
import updateAddToCartProduct from "../controllers/cart/updateAddToCartProduct.js";
import verifyOtpController from "../controllers/mail/otpVerification.js";
import filterProductController from "../controllers/product/filterProduct.js";
import getCategoryProduct from "../controllers/product/getCategoryProductOne.js";
import getCategoryWiseProduct from "../controllers/product/getCategoryWiseProduct.js";
import getProductController from "../controllers/product/getProduct.js";
import getProductDetails from "../controllers/product/getProductDetails.js";
import searchProduct from "../controllers/product/searchProduct.js";
import updateProductController from "../controllers/product/updateProduct.js";
import UploadProductController from "../controllers/product/uploadProduct.js";
import forgotPassword from "../controllers/user/forgotPassword.js";
import userLogout from "../controllers/user/userLogout.js";
import userSignInController from "../controllers/user/userSignIn.js";
import userSignUpController from "../controllers/user/userSignup.js";
import verifyOTP from "../controllers/user/verifyOTP.js";
import authToken from "../Middleware/authToken.js";
const router = express.Router();

//user
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);
router.post("/verify-otp", verifyOtpController);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-password", verifyOTP);

//admin panel
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);

//product
router.post("/upload-product", authToken, UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);

//user add to cart
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

export default router;
