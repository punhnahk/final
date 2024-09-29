import Post from "../models/posts.js";
import Product from "../models/products.js";

const PostController = {
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate(["author", "category"])
        .sort("-createdAt")
        .exec();

      res.json(posts);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getRelatedPosts: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id).exec();
      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const postRelated = await Post.find({
        $and: [
          {
            _id: { $ne: post._id },
          },
          {
            category: post.category,
          },
        ],
      })
        .populate(["category", "author"])
        .exec();

      res.json(postRelated);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, thumbnail, category, description, content } = req.body;
      const author = req.user.id;

      const post = await new Post({
        title,
        thumbnail,
        category,
        description,
        content,
        author,
      }).save();

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate(["author", "category"])
        .exec();

      const products = await Product.find({ posts: post._id });

      res.json({
        ...post.toJSON(),
        products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, thumbnail, category, description, content } = req.body;

      const post = await Post.findByIdAndUpdate(
        id,
        {
          title,
          thumbnail,
          category,
          description,
          content,
        },
        { new: true }
      ).exec();

      res.json(post);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findByIdAndDelete(id).exec();

      res.json(post);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default PostController;
