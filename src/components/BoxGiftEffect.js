import React, { useState } from "react";
import { cn } from "@/utils/classname";

export default function BoxGiftEffect({ onFinish }) {
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
    <div className="flex flex-col items-center justify-center">
      <button
        className="focus:outline-none bg-transparent border-none p-0"
        onClick={handleOpen}
        disabled={isOpening || isOpened}
      >
        <img
          src={"/box.svg"}
          alt="Gift Box"
          className={cn(
            "size-48 transition-all duration-700",
            isOpening ? "scale-110 rotate-6 brightness[1.2]" : "scale-100"
          )}
        />
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Mở hộp quà</p>
        </div>
      </button>
    </div>
  );
}
