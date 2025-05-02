"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useSpinWheelStore } from "@/store";
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
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { prize } = useSpinWheelStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-primary-color">
        <span>Vòng Quay May Mắn</span>
      </h1>

      {prize && (
        <div className="w-full m-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
          <h2 className="text-xl font-bold">Chúc mừng!</h2>
          <p className="text-lg">Bạn đã trúng: {prize}</p>
        </div>
      )}

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-6">
        <SpinWheelClient />
      </div>
    </>
  );
}
