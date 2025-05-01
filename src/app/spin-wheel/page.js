"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SpinWheelClient = dynamic(() => import("./SpinWheelClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg mx-auto mb-6 h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p className="text-xl">Đang tải vòng quay...</p>
    </div>
  ),
});

export default function SpinWheel() {
  const [winner, setWinner] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-3xl font-bold mb-6">Vòng Quay May Mắn</h1>

      {winner && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
          <h2 className="text-xl font-bold">Chúc mừng!</h2>
          <p className="text-lg">Bạn đã trúng: {winner}</p>
        </div>
      )}

      <SpinWheelClient winner={winner} setWinner={setWinner} />

      <div className="mt-4">
        <Link
          href="/"
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Quay về
        </Link>
      </div>
    </div>
  );
}
