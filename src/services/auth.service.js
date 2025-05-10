import axios from "@/lib/axios";

export const authService = {
  login: async (email, password) => {
    return axios.post("/auth/login", { email, password });
  },
  logout: async () => {
    return axios.post("/auth/logout");
  },
  verify: async () => {
    return axios.post("/auth/verify");
  },
};
