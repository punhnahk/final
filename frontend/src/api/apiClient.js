import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../constants";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_APP_API,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      config["headers"] = {
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
