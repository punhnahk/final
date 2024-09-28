import express from "express";
import CategoryController from "../controllers/categories.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getCategories);
categoryRouter.get("/:id", CategoryController.getCategory);
categoryRouter.post(
  "/",
  checkLogin,
  isAdmin,
  CategoryController.createCategory
);
categoryRouter.put(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.updateCategory
);
categoryRouter.delete(
  "/:id",
  checkLogin,
  isAdmin,
  CategoryController.deleteCategory
);

export default categoryRouter;
