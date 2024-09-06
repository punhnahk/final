import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api", // Or wherever your backend API is hosted
});

export default instance;
