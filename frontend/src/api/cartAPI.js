import axios from "axios";
import { BASE_URL } from "./api";

export const getCart = async () => {
  const response = await axios.get(`${BASE_URL}/api/cart`);
  return response.data;
};

// Add a product to the cart
export const addToCart = async (productId, quantity) => {
  const response = await axios.post(`${BASE_URL}/api/cart`, {
    productId,
    quantity,
  });
  return response.data;
};

// Remove a product from the cart
export const removeFromCart = async (productId) => {
  const response = await axios.delete(`${BASE_URL}/api/cart`, {
    data: { productId },
  });
  return response.data;
};

// Update product quantity in the cart
export const updateCartProduct = async (productId, quantity) => {
  const response = await axios.put(`${BASE_URL}/api/cart`, {
    productId,
    quantity,
  });
  return response.data;
};
