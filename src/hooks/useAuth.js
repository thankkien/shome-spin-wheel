import { create } from "zustand";
import { authService } from "@/services/auth.service";

export const useAuth = create((set) => ({
  user: null,

  login: async (email, password) => {
    try {
      const data = await authService.login(email, password);
      set({
        user: data.user,
      });
      return data.success;
    } catch (error) {
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({
        user: null,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  verify: async () => {
    try {
      const data = await authService.verify();
      set({
        user: data.user,
      });
      return data.success;
    } catch (error) {
      return false;
    }
  },
}));
