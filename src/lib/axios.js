import axios from "axios";

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
  (response) =>  response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response || { success: false, error: "Lỗi server" });
    }
    return Promise.reject({
      success: false,
      error: "Không thể kết nối đến server",
    });
  }
);

export default axiosInstance;
