import express from "express";
import CategoryController from "../controllers/postCategories.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const postCategoryRouter = express.Router();

postCategoryRouter.get("/", CategoryController.getCategories);
postCategoryRouter.get("/:id", CategoryController.getCategory);
postCategoryRouter.post(
  "/",
  checkLogin,
  isAdmin,
  CategoryController.createCategory
);
postCategoryRouter.put(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.updateCategory
);
postCategoryRouter.delete(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.deleteCategory
);

export default postCategoryRouter;
