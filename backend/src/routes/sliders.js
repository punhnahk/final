import express from "express";
import SliderController from "../controllers/sliders.js";
import { checkLogin, isAdmin } from "../middlewares/auth.js";

const sliderRouter = express.Router();

sliderRouter.get("/", SliderController.getSliders);
sliderRouter.get("/:id", checkLogin, isAdmin, SliderController.getSlider);
sliderRouter.post("/", checkLogin, isAdmin, SliderController.createSlider);
sliderRouter.put("/:id", checkLogin, isAdmin, SliderController.updateSlider);
sliderRouter.delete("/:id", checkLogin, isAdmin, SliderController.deleteSlider);

export default sliderRouter;
