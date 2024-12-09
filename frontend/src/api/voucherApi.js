import apiClient from "./apiClient";

const voucherApi = {
  getVouchers: () => apiClient.get("/vouchers"),
  getVoucher: (id) => apiClient.get(`/vouchers/${id}`),
  createVoucher: (data) => apiClient.post("/vouchers", data),
  updateVoucher: (id, data) => {
    if (!id) {
      throw new Error("ID is required for updating a voucher");
    }
    return apiClient.put(`/vouchers/${id}`, data);
  },
  deleteVoucher: (id) => apiClient.delete(`/vouchers/${id}`),
  getVoucherByCode: (code) => apiClient.get(`/vouchers/code/${code}`),
  sendVoucher: (id, email) => apiClient.post(`/vouchers/send/${id}`, { email }),
  deleteVoucherUsage: (data) => apiClient.post("/vouchers/delete-usage", data),
};

export default voucherApi;
