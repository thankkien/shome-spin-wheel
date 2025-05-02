"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpinWheelStore } from "@/store";
import { cn } from "@/utils/classname";
import { Wheel } from "spin-wheel";
import items from "@/config/items";

export default function SpinWheelClient() {
  const wheelContainerRef = useRef(null);
  const { isSpinning, setIsSpinning, prize, setPrize } = useSpinWheelStore();
  const [wheel, setWheel] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);

  const calcSpinToValues = useCallback(() => {
    const itemIndex = Math.floor(Math.random() * items.length);
    const duration = Math.floor(Math.random() * (3600 - 2600 + 1)) + 2600;
    return [itemIndex, duration];
  }, [items]);

  const handleSpin = () => {
    if (!wheel || isSpinning) return;
    setIsSpinning(true);
    wheel.spinToItem(...calcSpinToValues());
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => setOverlayImg(img);
    img.onerror = (error) =>
      console.error("Lỗi khi tải hình ảnh overlay:", error);
    img.src = "/overlay.svg";
  }, []);

  useEffect(() => {
    if (!overlayImg || !wheelContainerRef.current || wheel) return;

    try {
      const props = {
        name: "SHome",
        radius: 0.88,
        itemLabelRadius: 0.93,
        itemLabelRotation: 180,
        itemLabelAlign: "left",
        itemLabelColors: ["#000"],
        itemLabelBaselineOffset: -0.06,
        itemLabelFont: "Arial",
        itemLabelFontSizeMax: 22,
        lineWidth: 1,
        lineColor: "#000",
        overlayImage: overlayImg,
        items,
        isInteractive: false,
        onRest: (event) => {
          const { currentIndex } = event;
          const winningItem = items[currentIndex];
          if (setPrize) setPrize(winningItem.label);
          setIsSpinning(false);
        },
        onSpin: () => {
          setIsSpinning(true);
          if (setPrize) setPrize(null);
        },
      };

      const newWheel = new Wheel(wheelContainerRef.current, props);
      setWheel(newWheel);
    } catch (error) {
      console.error("Lỗi khởi tạo vòng quay:", error);
    }
  }, [overlayImg, items, setPrize]);

  return (
    <div className="relative">
      <div
        ref={wheelContainerRef}
        className={cn(
          "size-73 md:size-82 mx-auto transition-opacity duration-300",
          !isSpinning && !prize ? "opacity-60" : "opacity-100"
        )}
      ></div>

      {!prize && (
        <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning || !wheel}
            className={cn(
              "px-8 py-3 rounded-full text-white font-bold text-lg transition-colors shadow-lg",
              isSpinning || !wheel
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSpinning ? "Đang quay..." : wheel ? "QUAY NGAY" : "Đang tải..."}
          </button>
        </div>
      )}
    </div>
  );
}
