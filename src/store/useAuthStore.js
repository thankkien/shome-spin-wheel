import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      error: "",
      loading: false,
      userData: null,
      spinStatus: null,

      login: async (email, password) => {
        try {
          set({ loading: true, error: "" });
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
              loading: false,
            });
            return false;
          }

          set({
            isLoggedIn: true,
            user: data.user,
            error: "",
            loading: false,
          });
          return true;
        } catch (error) {
          set({ error: "Lỗi kết nối máy chủ", loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          await fetch("/api/auth/logout", {
            method: "POST",
          });

          set({
            isLoggedIn: false,
            user: null,
            error: "",
            loading: false,
            userData: null,
            spinStatus: null
          });
          return true;
        } catch (error) {
          set({ loading: false });
          return false;
        }
      },

      fetchUserData: async (forceReload = false) => {
        const { user, userData } = get();
        
        if (userData && !forceReload) {
          return userData;
        }
        
        if (!user || !user.id) return null;

        try {
          set({ loading: true });
          const response = await fetch(`/api/auth/user?id=${user.id}`);
          const data = await response.json();

          if (data.success) {
            set({ 
              userData: data,
              spinStatus: data.spinStatus,
              loading: false 
            });
            return data;
          } else {
            set({ 
              error: data.error || "Không thể lấy thông tin người dùng",
              loading: false
            });
            return null;
          }
        } catch (error) {
          set({ loading: false, error: "Lỗi kết nối máy chủ" });
          return null;
        }
      },

      clearError: () => set({ error: "" }),
    }),
    {
      name: "auth-storage",
    }
  )
);
