import apiClient from "./apiClient";

const userApi = {
  getUsers: () => {
    return apiClient.get("/users");
  },
  getUser: (id) => {
    return apiClient.get(`/users/${id}`);
  },
  updateUser: ({ id, ...data }) => {
    return apiClient.put(`/users/${id}`, data);
  },
  deleteUser: (id) => {
    return apiClient.delete(`/users/${id}`);
  },
  getProfile: () => {
    return apiClient.get("/users/profile");
  },
  updateProfile: (data) => {
    return apiClient.put("/users/profile", data);
  },
  changePassword: (data) => {
    return apiClient.post("/users/profile/change-password", data);
  },
};

export default userApi;
