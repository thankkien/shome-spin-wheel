import axios from "@/lib/axios";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      return response;
    } catch (error) {
      throw (
        error.response?.data || { success: false, error: "Lỗi kết nối máy chủ" }
      );
    }
  },

  logout: async () => {
    try {
      const response = await axios.post("/auth/logout");
      return response;
    } catch (error) {
      throw error.response?.data || { success: false, error: "Lỗi đăng xuất" };
    }
  },

  verify: async () => {
    try {
      const response = await axios.post("/auth/verify");
      return response;
    } catch (error) {
      throw error.response?.data || { success: false, error: "Lỗi xác thực" };
    }
  },
};
