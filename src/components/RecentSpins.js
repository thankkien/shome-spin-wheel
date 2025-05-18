import React, { useEffect } from "react";
import { useSpinWheelStore } from "@/stores";

export default function RecentSpins() {
  const recentSpins = useSpinWheelStore((state) => state.recentSpins);
  const getRecentSpins = useSpinWheelStore((state) => state.getRecentSpins);

  useEffect(() => {
    getRecentSpins();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between gap-1 p-4 text-xs text-gray-500">
      {recentSpins.map((spin, idx) => (
        <div
          className="text-center"
          key={spin.id}
        >
          {spin.user_name} đã quay được {spin.prize_label}
        </div>
      ))}
    </div>
  );
}
