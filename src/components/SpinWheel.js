"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpinWheelStore } from "@/stores";
import { cn } from "@/utils/classname";
import { Wheel } from "spin-wheel";

export default function SpinWheelClient() {
  const wheelContainerRef = useRef(null);

  const {
    prizeList,
    prize,
    setPrize,
    hasSpun,
    setHasSpun,
    spin,
    isSpinning,
    setIsSpinning,
    isLoading,
    fetchPrizes,
  } = useSpinWheelStore((state) => state);
  const [wheel, setWheel] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);

  const calcSpinToValues = useCallback((itemIndex) => {
    const duration = Math.floor(Math.random() * (3600 - 2600 + 1)) + 2600;
    const spinToCenter = false;
    const numberOfRevolutions = 10;
    const direction = 1;
    const easingFunction = null;
    return [
      itemIndex,
      duration,
      spinToCenter,
      numberOfRevolutions,
      direction,
      easingFunction,
    ];
  }, []);

  const handleSpin = async () => {
    if (!wheel || isSpinning || isLoading || hasSpun) return;

    const result = await spin();

    if (result.success) {
      const prizeIndex = prizeList.findIndex(
        (item) => item.id === result.prize.id
      );
      if (prizeIndex === -1) {
        return;
      }
      wheel.spinToItem(...calcSpinToValues(prizeIndex));
    } else {
      const { hasSpun, prize } = result;
      if (hasSpun !== undefined && hasSpun !== null) {
        setHasSpun(hasSpun);
      }
      if (prize !== undefined && prize !== null) {
        setPrize(prize);
      }
      alert(result.error || "Có lỗi xảy ra khi quay");
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

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
        onRest: (event) => {
          const { currentIndex } = event;
          const winningItem = prizeList[currentIndex];
          setPrize({ id: winningItem.id, label: winningItem.label });
          setHasSpun(true);
          setIsSpinning(false);
        },
        onSpin: () => {
          setIsSpinning(true);
        },
      };

      const newWheel = new Wheel(wheelContainerRef.current, props);
      setWheel(newWheel);

      // init prize
      if (prize) {
        const prizeIndex = prizeList.findIndex((item) => item.id === prize.id);
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
          "size-73 md:size-95 mx-auto transition-opacity duration-300",
          !isSpinning && !prize ? "opacity-60" : "opacity-100"
        )}
      ></div>

      {!hasSpun && !isSpinning && (
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
