import apiClient from "./apiClient";

const newsApi = {
  getAllNews: () => {
    return apiClient.get("/posts");
  },
  addNews: (data) => {
    return apiClient.post("/posts", data);
  },
  getNews: (id) => {
    return apiClient.get(`/posts/${id}`);
  },
  updateNews: ({ id, ...data }) => {
    return apiClient.put(`/posts/${id}`, data);
  },
  deleteNews: (id) => {
    return apiClient.delete(`/posts/${id}`);
  },
};

export default newsApi;
