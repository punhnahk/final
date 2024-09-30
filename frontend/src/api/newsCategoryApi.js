import apiClient from "./apiClient";

const newsCategoryApi = {
  getCategories: () => {
    return apiClient.get("/post-categories");
  },
  addCategory: (data) => {
    return apiClient.post("/post-categories", data);
  },
  getCategory: (id) => {
    return apiClient.get(`/post-categories/${id}`);
  },
  updateCategory: ({ id, ...data }) => {
    return apiClient.put(`/post-categories/${id}`, data);
  },
  deleteCategory: (id) => {
    return apiClient.delete(`/post-categories/${id}`);
  },
};

export default newsCategoryApi;
