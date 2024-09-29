import { model, Schema } from "mongoose";

const postCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostCategory = model("postCategories", postCategorySchema);
export default PostCategory;
