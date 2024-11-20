import express from "express";
import UserController from "../controllers/users.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/", checkLogin, isAdmin, UserController.getUsers);
userRouter.get("/profile", checkLogin, UserController.getProfile);
userRouter.get("/:id", checkLogin, isAdmin, UserController.getUser);
// userRouter.post("/", checkLogin, isAdmin, UserController.createCategory);
userRouter.put("/profile", checkLogin, UserController.updateProfile);
userRouter.post(
  "/profile/change-password",
  checkLogin,
  UserController.changeProfilePassword
);
userRouter.put("/:id", checkLogin, isAdmin, UserController.updateUser);
userRouter.delete("/:id", checkLogin, isAdmin, UserController.deleteUser);
userRouter.put(
  "/deactivate/:id",
  checkLogin,
  isAdmin,
  UserController.deactivateUser
);

export default userRouter;
