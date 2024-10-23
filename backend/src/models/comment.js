import { model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "products",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    content: {
      type: String,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "orders",
    },
  },
  { timestamps: true }
);

const Comment = model("comments", commentSchema);

export default Comment;
