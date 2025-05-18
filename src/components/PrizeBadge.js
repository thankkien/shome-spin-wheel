"use client";

import { cn } from "@/utils/classname";
import { useSpinWheelStore } from "@/stores";

export default function PrizeBadge() {
  const prize = useSpinWheelStore((state) => state.prize);
  if (!prize) return null;

  return (
    <div className="relative z-10 text-yellow-800 dark:text-yellow-200">
      <h2
        className={cn(
          "text-2xl font-extrabold mb-2 drop-shadow-md animate-pulse"
        )}
      >
        🎉 Chúc mừng! 🎉
      </h2>
      <p className="text-sm font-medium mb-1">Bạn đã quay trúng</p>
      <p
        className={cn(
          "text-xl font-bold px-4 py-2 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-20 rounded-lg inline-block transform transition-all duration-500 shadow-lg animate-prize-glow"
        )}
      >
        {prize.prize_label ?? ""}
      </p>
      <p className="text-sm font-medium mb-1">{prize.prize_description}</p>
    </div>
  );
}
