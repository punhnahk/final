import express from "express";
import { checkLogin, isAdmin } from "../middlewares/auth.js";
import PostController from "../controllers/posts.js";

const postRouter = express.Router();

postRouter.get("/", PostController.getPosts);
postRouter.get("/:id/related", PostController.getRelatedPosts);
postRouter.get("/:id", PostController.getPost);
postRouter.post("/", checkLogin, isAdmin, PostController.createPost);
postRouter.put("/:id", checkLogin, isAdmin, PostController.updatePost);
postRouter.delete("/:id", checkLogin, isAdmin, PostController.deletePost);

export default postRouter;
