import { useState } from "react";
import { cn } from "@/utils/classname";
import { useSpinWheelStore } from "@/stores";

export default function BoxGift({ onFinish }) {
  const prize = useSpinWheelStore((state) => state.prize);

  if (!prize) return null;

  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      if (onFinish) onFinish();
    }, 800);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        "text-yellow-800 dark:text-yellow-200"
      )}
    >
      <button
        className={cn(
          "focus:outline-none bg-transparent border-none p-0",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] z-100"
        )}
        onClick={handleOpen}
        disabled={isOpening || isOpened}
      >
        <img
          src="/assets/box.svg"
          className={cn(
            "max-w-48 size-48 transition-all duration-700",
            isOpening ? "scale-110 rotate-6 brightness-[1.2]" : "scale-100"
          )}
          alt="box"
        />
        <div className="mt-4">
          <p className="text-sm whitespace-nowrap capitalize font-medium mb-1">
            Hộp quà {prize.prize_label} bí ẩn
          </p>
        </div>
      </button>
    </div>
  );
}
