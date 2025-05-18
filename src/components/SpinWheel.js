"use client";

import { useEffect, useRef, useState } from "react";
import { useSpinWheelStore } from "@/stores";
import { cn } from "@/utils/classname";
import { Wheel } from "spin-wheel";

export default function SpinWheelClient() {
  const prizeList = useSpinWheelStore((state) => state.prizeList);
  const prizes = useSpinWheelStore((state) => state.prizes);
  const spin = useSpinWheelStore((state) => state.spin);
  const isSpinning = useSpinWheelStore((state) => state.isSpinning);
  const setIsSpinning = useSpinWheelStore((state) => state.setIsSpinning);
  const isLoading = useSpinWheelStore((state) => state.isLoading);
  const isCanSpin = useSpinWheelStore((state) => state.isCanSpin);

  const wheelContainerRef = useRef(null);

  const [wheel, setWheel] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);

  const spinCallback = useSpinWheelStore((state) => state.spinCallback);
  const spinCallbackRef = useRef(spinCallback);
  useEffect(() => {
    spinCallbackRef.current = spinCallback;
  }, [spinCallback]);

  const handleSpin = async () => {
    if (!wheel || isSpinning || isLoading || !isCanSpin) {
      return;
    }
    const props = await spin();
    if (props) {
      const audio = new Audio("/PrizeWheelSpinSound.mp3");
      audio.play();
      wheel.spinToItem(...props);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => setOverlayImg(img);
    img.onerror = (error) => {
      console.error("Lỗi khi tải hình ảnh overlay:", error);
    };
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
        itemLabelBaselineOffset: -0.06,
        itemLabelFont: "Be Vietnam Pro",
        itemLabelFontSizeMax: 24,
        itemLabelFontWeight: "bold",
        lineWidth: 2,
        lineColor: "#2E51BF",
        overlayImage: overlayImg,
        items: prizeList,
        isInteractive: false,
        onRest: () => spinCallbackRef.current(),
        onSpin: () => setIsSpinning(true),
      };

      const newWheel = new Wheel(wheelContainerRef.current, props);
      setWheel(newWheel);

      // init prize
      if (prizes?.length) {
        const prizeIndex = prizeList.findIndex(
          (item) => item.id === prizes.at(-1)?.prize_id
        );
        if (prizeIndex !== -1) {
          newWheel.spinToItem(prizeIndex, 0, false, 0, 1, null);
        }
      }
    } catch (error) {
      console.error("Lỗi khởi tạo vòng quay:", error);
    }
  }, [overlayImg]);

  return (
    <div className="relative">
      <div
        ref={wheelContainerRef}
        className={cn(
          "size-80 sm:size-95 mx-auto transition-opacity duration-300",
          !isSpinning && !prizes?.length ? "opacity-60" : "opacity-100"
        )}
      ></div>

      {isCanSpin && !isSpinning && (
        <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center">
          <button
            onClick={handleSpin}
            disabled={!wheel || isLoading}
            className={cn(
              "px-8 py-3 rounded-full text-white font-bold text-lg transition-colors shadow-lg",
              !wheel || isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isLoading ? "ĐANG XỬ LÝ..." : wheel ? "QUAY NGAY" : "Đang tải..."}
          </button>
        </div>
      )}
    </div>
  );
}
