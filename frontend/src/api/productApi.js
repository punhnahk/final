import axios from "axios";

const BASE_URL = "http://localhost:4000/api"; // Your backend URL

export const fetchProducts = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products`);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
