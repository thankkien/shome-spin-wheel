import { cn } from "@/utils/classname";
import { getRandomVariant } from "@/utils/getRandomVariant";
import { useState, useCallback } from "react";
import { nanoid } from "nanoid";

const colorClasses = [
  "bg-yellow-400",
  "bg-pink-500",
  "bg-cyan-400",
  "bg-fuchsia-500",
  "bg-green-400",
  "bg-blue-400",
  "bg-red-400",
  "bg-orange-400",
  "bg-purple-400",
  "bg-teal-400",
  "bg-lime-400",
  "bg-amber-400",
];

export default function Confetti({ index, length }) {
  const [key, setKey] = useState(nanoid());
  const [colorClass, setColorClass] = useState(() =>
    getRandomVariant(colorClasses)
  );
  const [randomDelay, setRandomDelay] = useState(() => Math.random() * 1.5);
  const [randomDuration, setRandomDuration] = useState(() => 1.5 + Math.random() * 1.5);

  const handleAnimationEnd = useCallback(() => {
    setColorClass(getRandomVariant(colorClasses));
    setRandomDelay(Math.random() * 1.5);
    setRandomDuration(1.5 + Math.random() * 1.5);
    setKey(nanoid());
  }, []);

  return (
    <div
      key={key}
      style={{
        left: `${(index / (length - 1)) * 100}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
      }}
      className={cn(
        "absolute top-0 w-1 h-3 opacity-0 animate-confetti-fall",
        colorClass
      )}
      onAnimationEnd={handleAnimationEnd}
    />
  );
}
