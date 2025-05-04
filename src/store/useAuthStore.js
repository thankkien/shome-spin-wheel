import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      error: "",
      isLoading: false,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: "" });
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!data.success) {
            set({
              error: data.error || "Đăng nhập không thành công",
              isLoading: false,
            });
            return false;
          }

          set({
            user: data.user,
            error: "",
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ error: "Lỗi kết nối máy chủ" });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await fetch("/api/auth/logout", {
            method: "POST",
          });

          set({
            user: null,
            error: "",
            isLoading: false,
          });
          return true;
        } catch (error) {
          return false;
        }
      },

      clearError: () => set({ error: "" }),
    }),
    {
      name: "auth-storage",
    }
  )
);
