import express from "express";
import Wishlist from "../controllers/wishlist.js";
import { checkLogin } from "../middlewares/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", checkLogin, Wishlist.addToWishlist);
wishlistRouter.post(
  "/remove/:productId",
  checkLogin,
  Wishlist.removeFromWishlist
);
wishlistRouter.get("/", checkLogin, Wishlist.getWishlist);

export default wishlistRouter;
