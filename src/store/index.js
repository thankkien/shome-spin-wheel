import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      error: "",

      login: (email, password) => {
        if (!email || !password) {
          set({ error: "Vui lòng nhập đầy đủ thông tin", isLoggedIn: false });
          return false;
        }

        set({
          isLoggedIn: true,
          user: { email },
          error: "",
        });
        return true;
      },

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          error: "",
        }),

      clearError: () => set({ error: "" }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useSpinWheelStore = create(
  persist(
    (set) => ({
      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),

      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      prize: null,
      setPrize: (prize) => set({ prize }),

      prizeList: [],
      setPrizeList: (prizeList) => set({ prizeList }),
    }),
    {
      name: "spin-wheel-storage",
    }
  )
);
