import { model, Schema } from "mongoose";

const sliderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Slider = model("sliders", sliderSchema);
export default Slider;
