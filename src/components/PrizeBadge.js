"use client";

import { cn } from "@/utils/classname";
import { useEffect, useState } from "react";
import { useSpinWheel } from "@/hooks";

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
      {/* Hiệu ứng pháo hoa nền */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Góc */}
        <div
          className={cn(
            "absolute -top-4 -left-4 w-8 h-8 bg-pink-500 rounded-full opacity-0 animate-firework1"
          )}
        ></div>
        <div
          className={cn(
            "absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-0 animate-firework2"
          )}
        ></div>
        <div
          className={cn(
            "absolute -bottom-4 -left-4 w-8 h-8 bg-green-500 rounded-full opacity-0 animate-firework3"
          )}
        ></div>
        <div
          className={cn(
            "absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500 rounded-full opacity-0 animate-firework4"
          )}
        ></div>

        {/* Thêm nhiều pháo hoa hơn ở các vị trí khác */}
        <div
          className={cn(
            "absolute top-1/3 -left-2 w-6 h-6 bg-orange-500 rounded-full opacity-0 animate-firework5"
          )}
        ></div>
        <div
          className={cn(
            "absolute top-1/3 -right-2 w-6 h-6 bg-teal-500 rounded-full opacity-0 animate-firework6"
          )}
        ></div>
        <div
          className={cn(
            "absolute top-1/4 left-1/4 w-5 h-5 bg-red-500 rounded-full opacity-0 animate-firework7"
          )}
        ></div>
        <div
          className={cn(
            "absolute top-1/4 right-1/4 w-5 h-5 bg-indigo-500 rounded-full opacity-0 animate-firework8"
          )}
        ></div>

        {/* Hiệu ứng tỏa sáng từ trung tâm */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full opacity-0 animate-starburst"
          )}
        ></div>

        {/* Hiệu ứng kim tuyến rơi */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute top-0 w-1 h-3 opacity-0",
              `left-[${Math.floor(Math.random() * 100)}%]`,
              animate ? `animate-confetti-${(i % 5) + 1}` : ""
            )}
            style={{
              backgroundColor: [
                "#FFD700",
                "#FF007F",
                "#00FFFF",
                "#FF00FF",
                "#00FF00",
              ][i % 5],
              left: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Viền sáng đặc biệt */}
      <div
        className={cn(
          "absolute inset-0 border-4 border-transparent opacity-0 rounded-lg animate-sparkle-border"
        )}
      ></div>

      {/* Nội dung chính */}
      <div className="relative z-10">
        <h2
          className={cn(
            "text-2xl font-extrabold text-yellow-800 dark:text-yellow-200 mb-2 drop-shadow-md animate-pulse"
          )}
        >
          🎉 Chúc mừng! 🎉
        </h2>
        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">
          Bạn đã quay trúng
        </p>
        <p
          className={cn(
            "text-xl font-bold  text-yellow-800 dark:text-yellow-200 px-4 py-2",
            "bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-20 rounded-lg inline-block",
            "transform transition-all duration-500 shadow-lg",
            animate ? "scale-110 animate-prize-glow" : ""
          )}
        >
          {prize?.label ?? ""}
        </p>
      </div>
    </div>
  );
}
