import apiClient from "./apiClient";

const commentApi = {
  getCommentsByOrderId: (orderId) => {
    return apiClient.get(`/comments/order/${orderId}`);
  },
  getCommentsByProductId: (productId) => {
    return apiClient.get(`/comments/product/${productId}`);
  },
  addComment: (data) => {
    return apiClient.post("/comments", data);
  },
  checkComment: (data) => {
    return apiClient.get("/comments/check", data);
  },
  deleteComment: (commentId) => {
    return apiClient.delete(`/comments/${commentId}`);
  },
};

export default commentApi;
