import apiClient from "./apiClient";

const cartApi = {
  getMyCarts: () => {
    return apiClient.get("/carts/my-carts");
  },
  updateQuantity: ({ productId, quantity }) => {
    return apiClient.put("/carts", { productId, quantity });
  },
  deleteProduct: (productId) => {
    return apiClient.delete(`/carts/${productId}`);
  },
  addCart: ({ productId, quantity }) => {
    return apiClient.post("/carts", { productId, quantity });
  },
};

export default cartApi;
