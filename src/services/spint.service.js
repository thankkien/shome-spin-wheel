import axios from "@/lib/axios";

export const spinService = {
  getPrizes: async () => {
    return axios.get("/prizes");
  },
  getSpinStatus: async () => {
    return axios.get("/spin");
  },
  spin: async () => {
    return axios.post("/spin");
  },
};
