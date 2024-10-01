import apiClient from "./apiClient";

const categoryApi = {
  getCategories: () => {
    return apiClient.get("/categories");
  },
  addCategory: (data) => {
    return apiClient.post("/categories", data);
  },
  getCategory: (id) => {
    return apiClient.get(`/categories/${id}`);
  },
  updateCategory: ({ id, ...data }) => {
    return apiClient.put(`/categories/${id}`, data);
  },
  deleteCategory: (id) => {
    return apiClient.delete(`/categories/${id}`);
  },
};

export default categoryApi;
