import apiClient from "./apiClient";

const productApi = {
  getProducts: (params) => {
    return apiClient.get("/products", {
      params,
    });
  },
  addProduct: (data) => {
    return apiClient.post("/products", data);
  },
  getProduct: (id) => {
    return apiClient.get(`/products/${id}`);
  },
  updateProduct: ({ id, ...data }) => {
    return apiClient.put(`/products/${id}`, data);
  },
  deleteProduct: (id) => {
    return apiClient.delete(`/products/${id}`);
  },
  getProductsHome: () => {
    return apiClient.get("/products/home");
  },
  getRelatedProduct: (productId) => {
    return apiClient.get(`/products/${productId}/related`);
  },
};

export default productApi;
