import multer from "multer";
import cloudinary from "../config/cloudinaryConfig";
import { ProductModel } from "../models/ProductModel";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      salePrice,
      category,
      rating,
      numReviews,
      reviews,
      comments,
    } = req.body;

    let result = {};
    if (req.file) {
      result = await cloudinary.uploader.upload_stream(req.file.buffer, {
        folder: "products",
      });
    }

    const newProduct = new ProductModel({
      name,
      price,
      salePrice,
      category,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      rating,
      numReviews,
      reviews,
      comments,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      salePrice,
      category,
      rating,
      numReviews,
      reviews,
      comments,
    } = req.body;

    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
      const result = await cloudinary.uploader.upload_stream(req.file.buffer, {
        folder: "products",
      });
      product.image = result.secure_url;
      product.cloudinary_id = result.public_id;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.category = category || product.category;
    product.rating = rating || product.rating;
    product.numReviews = numReviews || product.numReviews;
    product.reviews = reviews || product.reviews;
    product.comments = comments || product.comments;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await cloudinary.uploader.destroy(product.cloudinary_id);
    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

