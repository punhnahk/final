import PostCategory from "../models/postCategories.js";

const PostCategoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await PostCategory.find().sort("-createdAt").exec();

      res.json(categories);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await new PostCategory({ name }).save();

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await PostCategory.findById(id).exec();

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;

      const category = await PostCategory.findByIdAndUpdate(
        id,
        {
          name,
        },
        { new: true }
      ).exec();

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await PostCategory.findByIdAndDelete(id).exec();

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default PostCategoryController;
