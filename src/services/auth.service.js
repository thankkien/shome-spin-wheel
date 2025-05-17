import axios from "@/lib/axios";

export const authService = {
  login: async (employeeId, password) => {
    return axios.post("/auth/login", { employeeId, password });
  },
  logout: async () => {
    return axios.post("/auth/logout");
  },
};
