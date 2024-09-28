import express from "express";
import ProductController from "../controllers/products.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.get("/", ProductController.getProducts);
productRouter.get("/home", ProductController.getProductsHome);
productRouter.get("/:id/related", ProductController.getRelatedProducts);
productRouter.get("/:id", ProductController.getProduct);
productRouter.post("/", checkLogin, isAdmin, ProductController.createProduct);
productRouter.put("/:id", checkLogin, isAdmin, ProductController.updateProduct);
productRouter.delete(
  "/:id",
  checkLogin,
  isAdmin,
  ProductController.deleteProduct
);

export default productRouter;
