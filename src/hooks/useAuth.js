import { create } from "zustand";
import { authService } from "@/services/auth.service";

export const useAuth = create((set) => ({
  user: null,

  login: async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (!data.success) {
        set({
          user: null,
        });
        return false;
      }
      set({
        user: data.user,
      });
      return true;
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
      await authService.verify();
      if (!data.success) {
        set({
          user: null,
        });
        return false;
      }
      set({
        user: data.user,
      });
      return true;
    } catch (error) {
      return false;
    }
  },
}));
