import Category from "../models/categories.js";

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort("-createdAt").exec();

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
      const { name, image } = req.body;
      const category = await new Category({ name, image }).save();

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

      const category = await Category.findById(id).exec();

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

      const category = await Category.findByIdAndUpdate(
        id,
        {
          name,
          image,
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

      const category = await Category.findByIdAndDelete(id).exec();

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default CategoryController;
