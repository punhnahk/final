import express from "express";
import CommentController from "../controllers/comments.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const CommentRouter = express.Router();

// Route to add a new comment
CommentRouter.post("/", checkLogin, CommentController.addComment);

// Route to get comments by product ID
CommentRouter.get(
  "/product/:productId",
  CommentController.getCommentsByProductId
);
CommentRouter.get("/order/:orderId", CommentController.getCommentsByOrderId);

CommentRouter.get("/check", checkLogin, CommentController.checkUserComment);
CommentRouter.delete(
  "/:commentId",
  checkLogin,
  isAdmin,
  CommentController.deleteComment
);

export default CommentRouter;
