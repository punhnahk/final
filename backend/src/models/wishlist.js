import mongoose, { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = model("wishlist", wishlistSchema);
export default Wishlist;
