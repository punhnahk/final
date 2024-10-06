import apiClient from "./apiClient";

const authApi = {
  signIn: (data) => {
    return apiClient.post("/auth/login", data);
  },
  signUp: (data) => {
    return apiClient.post("/auth/register", data);
  },
  forgotPassword: (email) => {
    return apiClient.post("/auth/forgot-password", { email });
  },
  resetPassword: (data) => {
    return apiClient.post("/auth/reset-password", data);
  },
  googleSignUp: (data) => {
    return apiClient.post("/auth/google-signup", data); // Assuming the route is /auth/google-signup
  },
};

export default authApi;
