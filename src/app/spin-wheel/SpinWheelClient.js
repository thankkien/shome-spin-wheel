"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wheel } from "spin-wheel";
import items from "./items";

export default function SpinWheelClient({ winner, setWinner }) {
  const wheelContainerRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
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
    img.src = "/images/overlay.svg";
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
          if (setWinner) setWinner(winningItem.label);
          setIsSpinning(false);
        },
        onSpin: () => {
          setIsSpinning(true);
          if (setWinner) setWinner(null);
        },
      };

      const newWheel = new Wheel(wheelContainerRef.current, props);
      setWheel(newWheel);
    } catch (error) {
      console.error("Lỗi khởi tạo vòng quay:", error);
    }
  }, [overlayImg, items, setWinner]);

  return (
    <>
      <div
        ref={wheelContainerRef}
        className="w-full max-w-lg mx-auto mb-6 h-[500px]"
      ></div>

      {!winner && (
        <button
          onClick={handleSpin}
          disabled={isSpinning || !wheel}
          className={`mt-4 px-8 py-3 rounded-full text-white font-bold text-lg transition-colors ${
            isSpinning || !wheel
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSpinning ? "Đang quay..." : wheel ? "QUAY NGAY" : "Đang tải..."}
        </button>
      )}
    </>
  );
}
