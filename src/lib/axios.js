import axios from "axios";
import { useAuthStore } from "@/stores";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        useAuthStore.setState({ user: null });
        return Promise.reject("Unauthorized");
      }
      return Promise.reject(error.response.message ?? "Lỗi server");
    }
    if (error.request) {
      return Promise.reject("Lỗi kết nối");
    }
    return Promise.reject("Lỗi không xác định");
  }
);

export default axiosInstance;
