import apiClient from "./apiClient";

const orderApi = {
  getOrders: () => {
    return apiClient.get("/orders");
  },
  getOrder: (id) => {
    return apiClient.get(`/orders/${id}`);
  },
  updateStatus: ({ id, ...data }) => {
    return apiClient.put(`/orders/${id}`, data);
  },
  getOrdersHistory: () => {
    return apiClient.get("/orders/my-orders");
  },
  createOrder: (data) => {
    return apiClient.post("/orders", data);
  },
};

export default orderApi;
