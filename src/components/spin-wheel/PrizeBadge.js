"use client";

import { cn } from "@/utils/classname";
import { useSpinWheelStore } from "@/stores";

export default function PrizeBadge() {
  // Hàm parse động placeholder {oneMore}
  function parseDescription(description) {
    if (!description) return null;
    const regex = /({oneMore})/g;
    const parts = description.split(regex);
    return parts.map((part, idx) => {
      if (part === '{oneMore}') {
        return (
          <span key={idx} style={{ color: '#f59e42', fontWeight: 600 }}>
            và thêm 1 lượt quay may mắn!
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }
  const prize = useSpinWheelStore((state) => state.prize);

  if (!prize) return null;

  return (
    <div className="relative z-10 text-yellow-800 dark:text-yellow-200 p-2">
      <h2 className={cn("text-2xl font-extrabold mb-2 drop-shadow-md")}>
        🎉 Chúc mừng! 🎉
      </h2>
      <p className="text-xs font-medium text-yellow-600 dark:text-yellow-300 mb-1">Bạn đã quay trúng</p>
      <p
        className={cn(
          "text-xl font-bold px-4 py-2 bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-20 rounded-lg inline-block transform transition-all duration-500 shadow-lg animate-prize-glow"
        )}
      >
        {prize.prize_label ?? ""}
      </p>
      <p className="text-sm font-medium mb-4">{parseDescription(prize.prize_description)}</p>
      <p className="text-xs italic text-yellow-600 dark:text-yellow-300 ">Phần quà sẽ được gửi đến bạn trong vài ngày tới</p>
    </div>
  );
}
