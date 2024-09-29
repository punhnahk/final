import Slider from "../models/slider.js";

const SliderController = {
  getSliders: async (req, res) => {
    try {
      const sliders = await Slider.find().sort("-createdAt").exec();

      res.json(sliders);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  createSlider: async (req, res) => {
    try {
      const { title, image, url } = req.body;
      const slider = await new Slider({ title, image, url }).save();

      res.status(201).json(slider);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  getSlider: async (req, res) => {
    try {
      const { id } = req.params;

      const slider = await Slider.findById(id).exec();

      res.json(slider);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  updateSlider: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, image, url } = req.body;

      const category = await Slider.findByIdAndUpdate(
        id,
        {
          title,
          image,
          url,
        },
        { new: true }
      ).exec();

      res.json(category);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteSlider: async (req, res) => {
    try {
      const { id } = req.params;

      const slider = await Slider.findByIdAndDelete(id).exec();

      res.json(slider);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default SliderController;
