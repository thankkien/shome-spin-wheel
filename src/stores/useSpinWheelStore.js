import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as lodash from "lodash";
import { spinService } from "@/services/spint.service";

const calcSpinToValues = (itemIndex) => {
  const duration = Math.floor(Math.random() * (3600 - 2600 + 1)) + 2600;
  const spinToCenter = false;
  const numberOfRevolutions = 10;
  const direction = 1;
  const easingFunction = null;
  return [
    itemIndex,
    duration,
    spinToCenter,
    numberOfRevolutions,
    direction,
    easingFunction,
  ];
};

export const useSpinWheelStore = create(
  persist(
    (set, get) => ({
      isSpinning: false,
      isLoading: false,
      hasSpun: false,
      isCanSpin: true,
      prize: null,
      prizes: null,
      prizeList: [],
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      spinCallback: () => {},

      getSpinStatus: async () => {
        try {
          set({ isLoading: true });

          const { success, hasSpun, isCanSpin, prizes } =
            await spinService.getSpinStatus();

          if (success) {
            set({
              hasSpun,
              isCanSpin,
              prizes,
              prize: lodash.last(prizes),
            });
          }
          return { success, hasSpun, isCanSpin, prizes };
        } catch (error) {
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      getPrizes: async () => {
        try {
          set({ isLoading: true });

          const data = await spinService.getPrizes();

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

      spin: async () => {
        try {
          set({ isSpinning: true });
          const { hasSpun, isCanSpin, prizes } = await spinService.spin();
          const prize = lodash.last(prizes);

          const prizeIndex = get().prizeList.findIndex(
            (item) => item.id === prize.prize_id
          );

          if (prizeIndex === -1) {
            throw new Error("Có lỗi khi quay");
          }
          set({
            spinCallback: () => {
              console.log("callback");
              set({
                hasSpun,
                isCanSpin,
                prizes,
                prize,
                isSpinning: false,
              });
            },
          });
          return calcSpinToValues(prizeIndex);
        } catch (error) {
          set({ isSpinning: false });
          return { success: false, error: error?.message || "Lỗi máy chủ" };
        }
      },
    }),
    {
      name: "spin-wheel-storage",
      partialize: (state) => {
        const { isSpinning, ...rest } = state;
        return rest;
      },
    }
  )
);
