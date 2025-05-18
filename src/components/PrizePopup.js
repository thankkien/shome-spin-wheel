"use client";

import { cn } from "@/utils/classname";
import { useEffect, useState } from "react";
import { useSpinWheelStore } from "@/stores";
import FireworkEffect from "./animation/FireworkEffect";
import ConfettiEffect from "./animation/ConfettiEffect";
import BoxGift from "./BoxGift";
import PrizeBadge from "./PrizeBadge";

export default function PrizePopup({ className }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showBox, setShowBox] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  const hasSpun = useSpinWheelStore((state) => state.hasSpun);
  const prize = useSpinWheelStore((state) => state.prize);
  const isHydrated = useSpinWheelStore((state) => state._hydrated);

  useEffect(() => {
    if (prize) {
      setShowPrize(false);
      setShowBox(true);
    }
  }, [prize]);

  const handleBoxFinish = () => {
    setShowBox(false);
    setShowPrize(true);
  };

  const handleClose = () => {
    if (showPrize) {
      setIsOpen(false);
      setShowBox(false);
      setShowPrize(false);
    }
  };

  if (!isHydrated || !hasSpun || !prize) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-2",
        isOpen ? "" : "hidden"
      )}
    >
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative h-50 w-full max-w-md mx-auto p-6 rounded-lg text-center overflow-hidden",
          "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600",
          "border-2 border-dashed border-yellow-500 dark:border-yellow-400",
          "shadow-xl transform transition-all duration-500",
          className
        )}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FireworkEffect />
          <ConfettiEffect />
        </div>
        <div className={cn("absolute inset-0 opacity-0")}></div>
        {showBox && <BoxGift onFinish={handleBoxFinish} />}
        {showPrize && <PrizeBadge />}
      </div>
    </div>
  );
}
