import axios from "axios";
import { BASE_URL } from "./api";
// Save the cart as an order and return the payment URL
export const saveCartToOrder = async () => {
  const response = await axios.post(`${BASE_URL}/api/orders/add-to-order`);
  return response.data;
};

// Fetch user orders
export const viewOrders = async () => {
  const response = await axios.get(`${BASE_URL}/api/orders`);
  return response.data;
};
