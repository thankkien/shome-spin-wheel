import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";


export const useSpinWheelStore = create(
  persist(
    (set, get) => ({
      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),

      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      prize: null,
      setPrize: (prize) => set({ prize }),

      spinStatus: null,
      setSpinStatus: (spinStatus) => set({ spinStatus }),

      prizeList: [],
      setPrizeList: (prizeList) => set({ prizeList }),

      spin: async (userId) => {
        if (!userId)
          return { success: false, error: "ID người dùng không hợp lệ" };

        try {
          set({ isSpinning: true, isLoading: true });

          const response = await fetch("/api/spin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();
          set({ isLoading: false });

          if (data.success) {
            set({
              prize: data.prize.prize_label,
              spinStatus: { hasSpun: true, prize: data.prize },
            });

            const authStore = useAuthStore.getState();
            authStore.spinStatus = { hasSpun: true, prize: data.prize };
            
            useAuthStore.setState({ userData: null });
            
            return { success: true, prize: data.prize };
          } else {
            return { success: false, error: data.error, prize: data.prize };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: "Lỗi kết nối máy chủ" };
        } finally {
          setTimeout(() => {
            set({ isSpinning: false });
          }, 3000); // Thêm thời gian chờ để animation vòng quay hoàn thành
        }
      },

      fetchSpinStatus: async (userId) => {
        if (!userId) return null;

        const authStore = useAuthStore.getState();
        if (authStore.spinStatus) {
          set({
            spinStatus: authStore.spinStatus,
            prize: authStore.spinStatus?.prize?.prize_label || null,
          });
          return authStore.spinStatus;
        }

        if (authStore.userData && authStore.userData.spinStatus) {
          set({
            spinStatus: authStore.userData.spinStatus,
            prize: authStore.userData.spinStatus?.prize?.prize_label || null,
          });
          return authStore.userData.spinStatus;
        }

        try {
          set({ isLoading: true });
          
          const data = await authStore.fetchUserData(true);
          
          if (data && data.success) {
            set({
              spinStatus: data.spinStatus,
              prize: data.spinStatus?.prize?.prize_label || null,
            });
            return data.spinStatus;
          }

          return null;
        } catch (error) {
          return null;
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
