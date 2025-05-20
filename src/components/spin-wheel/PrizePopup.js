"use client";

import { cn } from "@/utils/classname";
import { useEffect, useState } from "react";
import { useSpinWheelStore } from "@/stores";
import FireworkEffect from "../animation/FireworkEffect";
import ConfettiEffect from "../animation/ConfettiEffect";
import BoxGift from "./BoxGift";
import PrizeBadge from "./PrizeBadge";
import { Button } from "../ui/button";
import Letter from "./Letter";

export default function PrizePopup({ className }) {
  const hasSpun = useSpinWheelStore((state) => state.hasSpun);
  const prize = useSpinWheelStore((state) => state.prize);

  if (!hasSpun || !prize) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (prize) {
      setIsOpen(true);
      setShowBox(true);
      setShowPrize(false);
    }
  }, [prize]);

  const handleBoxFinish = () => {
    setShowBox(false);
    if (prize.prize_id === 11) {
      setShowLetter(true);
    } else {
      setShowPrize(true);
    }
  };

  const handleLetterFinish = () => {
    setShowLetter(false);
    setShowPrize(true);
  };

  const handleGiftFinish = () => {
    setIsOpen(false);
    setShowBox(false);
    setShowPrize(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-2",
        isOpen ? "" : "hidden"
      )}
    >
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
      <div
        className={cn(
          showLetter || showPrize ? "h-fit" : "h-50",
          "relative w-full max-w-md mx-auto p-6 rounded-lg text-center overflow-hidden",
          "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-600",
          "border-2 border-dashed border-yellow-500 dark:border-yellow-400",
          "shadow-xl transform transition-all duration-500",
          className
        )}
      >
        {(showBox || showPrize) && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FireworkEffect />
            <ConfettiEffect />
          </div>
        )}
        {showBox && <BoxGift onFinish={handleBoxFinish} />}
        {(showPrize || showLetter) && (
          <>
            {showLetter && <Letter onClick={handleLetterFinish} />}
            {showPrize && <PrizeBadge />}
            <Button
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black text-2xl font-bold shadow transition-all duration-200"
              onClick={showPrize ? handleGiftFinish : handleLetterFinish}
              aria-label="Đóng"
              style={{ lineHeight: 1 }}
              variant="ghost"
            >
              ×
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
