import { model, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = model("carts", cartSchema);
export default Cart;
