import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    view: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    brand: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "posts",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Product = model("products", productSchema);
export default Product;
