import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import * as lodash from "lodash";

export const useSpinWheelStore = create(
  persist(
    (set, get) => ({
      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      isLoading: false,
      hasSpun: null,
      setHasSpun: (hasSpun) => set({ hasSpun }),
      prize: null,
      setPrize: (prize) => set({ prize }),
      prizeList: [],

      spin: async () => {
        try {
          const authState = useAuthStore.getState();
          if (!authState?.user?.id) {
            return { success: false, error: "ID người dùng không hợp lệ" };
          }

          set({ isSpinning: true });

          const response = await fetch("/api/spin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: authState.user.id }),
          });

          const data = await response.json();

          return data;
        } catch (error) {
          return { success: false, error: "Lỗi kết nối máy chủ" };
        } finally {
          set({ isSpinning: false });
        }
      },

      fetchSpinStatus: async (userId) => {
        if (!userId) return null;

        try {
          set({ isLoading: true });

          const response = await fetch(`/api/spin?user-id=${userId}`, {
            method: "GET",
          });
          const data = await response.json();

          if (data.success) {
            set({
              hasSpun: data.hasSpun,
              prize: data.prize,
            });
          }
          return data;
        } catch (error) {
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchPrizes: async () => {
        try {
          set({ isLoading: true });

          const response = await fetch("/api/prizes", {
            method: "GET",
          });

          const data = await response.json();

          if (data.success) {
            const setupPrizeList = (prizeList) => {
              const styles = [
                {
                  backgroundColor: "#c9e4ff",
                  labelColor: "#152553",
                },
                {
                  backgroundColor: "#ffe2b8",
                  labelColor: "#152553",
                },
              ];
              return lodash.map(lodash.shuffle(prizeList), (prize, idx) => ({
                ...prize,
                weight: 1,
                ...styles[idx % styles.length],
              }));
            };
            set({ prizeList: setupPrizeList(data.prizes) });
          }

          return data;
        } catch (error) {
          console.error("Lỗi khi lấy danh sách giải thưởng:", error);
          return [];
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "spin-wheel-storage",
    }
  )
);
