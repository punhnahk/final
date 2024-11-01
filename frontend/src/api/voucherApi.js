import apiClient from "./apiClient";

const voucherApi = {
  getVouchers: () => apiClient.get("/vouchers"),
  getVoucher: (id) => apiClient.get(`/vouchers/${id}`),
  createVoucher: (data) => apiClient.post("/vouchers", data), // Removed trailing slash
  updateVoucher: (id, data) => {
    // Updated function signature
    if (!id) {
      throw new Error("ID is required for updating a voucher");
    }
    return apiClient.put(`/vouchers/${id}`, data);
  },
  deleteVoucher: (id) => apiClient.delete(`/vouchers/${id}`),
  getVoucherByCode: (code) => apiClient.get(`/vouchers/code/${code}`),
  sendVoucher: (id, email) => apiClient.post(`/vouchers/send/${id}`, { email }),
};

export default voucherApi;
