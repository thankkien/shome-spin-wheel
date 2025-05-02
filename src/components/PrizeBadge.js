"use client";

import { cn } from "@/utils/classname";

export default function PrizeBadge({ prize, className }) {
  if (!prize) return null;

  return (
    <div className={cn(
      "w-full p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center",
      className
    )}>
      <h2 className="text-xl font-bold">Chúc mừng!</h2>
      <p className="text-sm">Bạn đã quay trúng</p>
      <p className="text-lg font-semibold">{prize}</p>
    </div>
  );
} 