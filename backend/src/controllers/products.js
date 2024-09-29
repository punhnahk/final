import Product from "../models/products.js";
import Category from "../models/categories.js";

const ProductController = {
  getProducts: async (req, res) => {
    try {
      const { search } = req.query;
      const queryObj = {};
      if (search) {
        const nameRegex = new RegExp(search, "i");
        queryObj.name = {
          $regex: nameRegex,
        };
      }

      const products = await Product.find(queryObj)
        .populate(["category", "posts"])
        .sort("-createdAt")
        .exec();

      res.json(products);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getProductsHome: async (req, res) => {
    try {
      const categories = await Category.find().exec();
      const products = await Promise.all(
        categories.map(async (it) => {
          const products = await Product.find({ category: it._id }).exec();

          return {
            ...it.toJSON(),
            products,
          };
        })
      );

      res.json(products);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getRelatedProducts: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await Product.findById(id).exec();
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const productsRelated = await Product.find({
        $and: [
          {
            _id: { $ne: product._id },
          },
          {
            category: product.category,
          },
        ],
      })
        .populate(["category", "posts"])
        .exec();

      res.json(productsRelated);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, image, price, salePrice, category, description, posts } =
        req.body;
      const product = await new Product({
        name,
        image,
        price,
        salePrice,
        category,
        description,
        posts,
      }).save();

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndUpdate(
        id,
        {
          $inc: { view: 1 },
        },
        { new: true }
      )
        .populate(["category", "posts"])
        .exec();

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image, price, salePrice, category, description, posts } =
        req.body;

      const product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          image,
          price,
          salePrice,
          category,
          description,
          posts,
        },
        { new: true }
      ).exec();

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndDelete(id).exec();

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default ProductController;
