"use client";

import { cn } from "@/utils/classname";
import { useEffect, useState } from "react";
import { useSpinWheel } from "@/hooks";
import FireworkEffect from "./animation/FireworkEffect";
import ConfettiEffect from "./animation/ConfettiEffect";
export default function PrizeBadge({ className }) {
  const [animate, setAnimate] = useState(false);

  const hasSpun = useSpinWheel((state) => state.hasSpun);
  const prize = useSpinWheel((state) => state.prize);

  useEffect(() => {
    if (prize) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [prize]);

  if (!hasSpun) return null;

  return (
    <div
      className={cn(
        "w-full p-6 rounded-lg text-center relative overflow-hidden",
        "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600",
        "border-2 border-dashed border-yellow-500 dark:border-yellow-400",
        "transform transition-all duration-500",
        animate ? "scale-105" : "",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FireworkEffect />
        <ConfettiEffect />
      </div>

      {/* Viền sáng đặc biệt */}
      <div
        className={cn(
          "absolute inset-0 border-4 border-transparent opacity-0 rounded-lg animate-sparkle-border"
        )}
      ></div>

      {/* Nội dung chính */}
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
            "text-xl font-bold px-4 py-2 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-20 rounded-lg inline-block transform transition-all duration-500 shadow-lg animate-prize-glow",
            animate && "scale-110"
          )}
        >
          {prize?.label ?? ""}
        </p>
      </div>
    </div>
  );
}
