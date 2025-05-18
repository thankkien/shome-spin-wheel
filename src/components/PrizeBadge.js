"use client";

import { cn } from "@/utils/classname";
import { useEffect, useState } from "react";
import { useSpinWheelStore } from "@/stores";
import FireworkEffect from "./animation/FireworkEffect";
import ConfettiEffect from "./animation/ConfettiEffect";
import BoxGiftEffect from "./BoxGiftEffect";

export default function PrizeBadge({ className }) {
  const [animate, setAnimate] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showBox, setShowBox] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  const hasSpun = useSpinWheelStore((state) => state.hasSpun);
  const prize = useSpinWheelStore((state) => state.prize);

  useEffect(() => {
    if (prize) {
      setShowPrize(false);
      setShowBox(true);
      setAnimate(false);
    }
  }, [prize]);

  const handleBoxFinish = () => {
    setShowBox(false);
    setShowPrize(true);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 5000);
  };

  if (!hasSpun || !prize) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center", isOpen ? "" : "hidden")}>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm"
        onClick={() => setIsOpen((state) => !state)}
      />
      <div
        className={cn(
          "relative w-full max-w-md mx-auto p-6 rounded-lg text-center overflow-hidden",
          "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600",
          "border-2 border-dashed border-yellow-500 dark:border-yellow-400",
          "shadow-xl transform transition-all duration-500",
          animate ? "scale-105" : "",
          className
        )}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FireworkEffect />
          <ConfettiEffect />
        </div>
        <div
          className={cn(
            "absolute inset-0 border-4 border-transparent opacity-0 rounded-lg animate-sparkle-border"
          )}
        ></div>
        {showBox && <BoxGiftEffect onFinish={handleBoxFinish} />}
        {showPrize && (
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
              {prize?.prize_label ?? ""}
            </p>
            <p className="text-sm font-medium mb-1">{prize?.prize_description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
