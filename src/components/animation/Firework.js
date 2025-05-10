"use client";

import { cn } from "@/utils/classname";
import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { getRandomVariant } from "@/utils/getRandomVariant";

const sizeVariants = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
  xl: "size-5",
};

const animationVariants = {
  basic: "animate-firework",
  scatter: "animate-firework-scatter",
  burst: "animate-firework-burst",
};

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
];

const leftFractions = [
  "left-0",
  "left-1/4",
  "left-1/3",
  "left-1/2",
  "left-2/3",
  "left-3/4",
  "left-full",
];
const topFractions = [
  "top-0",
  "top-1/4",
  "top-1/3",
  "top-1/2",
  "top-2/3",
  "top-3/4",
  "top-full",
];


export default function Firework({ className, randomPosition = false }) {
  const [key, setKey] = useState(nanoid());
  const [sizeClass, setSizeClass] = useState(() =>
    getRandomVariant(sizeVariants)
  );
  const [animationClass, setAnimationClass] = useState(() =>
    getRandomVariant(animationVariants)
  );
  const [colorClass, setColorClass] = useState(() => getRandomVariant(colors));
  const [topClass, setTopClass] = useState(() =>
    getRandomVariant(topFractions)
  );
  const [leftClass, setLeftClass] = useState(() =>
    getRandomVariant(leftFractions)
  );

  const handleAnimationEnd = useCallback(() => {
    setSizeClass(getRandomVariant(sizeVariants));
    setAnimationClass(getRandomVariant(animationVariants));
    setColorClass(getRandomVariant(colors));
    setKey(nanoid());
    if (randomPosition) {
      setTopClass(getRandomVariant(topFractions));
      setLeftClass(getRandomVariant(leftFractions));
    }
  }, [randomPosition]);

  return (
    <div
      key={key}
      className={cn(
        "absolute rounded-full opacity-0",
        sizeClass,
        animationClass,
        colorClass,
        topClass,
        leftClass,
        className
      )}
      onAnimationEnd={handleAnimationEnd}
    />
  );
}
