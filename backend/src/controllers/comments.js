import comment from "../models/comment.js";

const CommentController = {
  // Add a new comment
  addComment: async (req, res) => {
    const { productId, content, orderId } = req.body; // Include orderId in request body

    if (!productId || !content || !orderId) {
      return res
        .status(400)
        .json({ message: "Product ID, content, and order ID are required." });
    }

    try {
      const existingComment = await comment.findOne({
        productId,
        userId: req.user.id,
      });

      if (existingComment) {
        return res.status(400).json({ message: "You can only comment once." });
      }

      const newComment = await comment.create({
        productId,
        userId: req.user.id,
        content,
        orderId, // Save the order ID when creating the comment
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res
        .status(500)
        .json({ message: "Error adding comment", error: error.message });
    }
  },

  // Get all comments for a product
  getCommentsByProductId: async (req, res) => {
    try {
      const { productId } = req.params;
      const comments = await comment
        .find({ productId })
        .populate("userId", "name avatar")
        .populate({ path: "orderId", select: "createdAt" }) // Populate orderId if needed
        .exec();

      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch comments." });
    }
  },
  getCommentsByOrderId: async (req, res) => {
    try {
      const { orderId } = req.params;
      const comments = await comment
        .find({ orderId })
        .populate("userId", "name avatar")
        .populate({ path: "orderId", select: "createdAt" }) // Populate orderId if needed
        .exec();

      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch comments." });
    }
  },

  // Check if user has commented on a product
  checkUserComment: async (req, res) => {
    const { productId } = req.query;

    try {
      const existingComment = await comment.findOne({
        productId,
        userId: req.user.id,
      });

      if (existingComment) {
        return res.status(200).json({ hasCommented: true });
      } else {
        return res.status(200).json({ hasCommented: false });
      }
    } catch (error) {
      console.error("Error checking user comment:", error);
      res
        .status(500)
        .json({ message: "Error checking comment", error: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    console.log("Incoming request parameters:", req.params);
    const { commentId } = req.params; // Get commentId from the route parameters

    console.log("Attempting to delete comment with ID:", commentId);
    try {
      // Find the comment
      const existingComment = await comment.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Check if the user is the owner of the comment or an admin
      if (
        existingComment.userId.toString() !== req.user.id &&
        req.user.role !== "ADMIN" // Assuming 'role' is part of the user object
      ) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this comment." });
      }

      // Delete the comment
      await comment.findByIdAndDelete(commentId);
      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res
        .status(500)
        .json({ message: "Error deleting comment", error: error.message });
    }
  },
};

export default CommentController;
