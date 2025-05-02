"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useSpinWheelStore } from "@/store";
import dynamic from "next/dynamic";
import PrizeBadge from "@/components/PrizeBadge";

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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-2xl font-bold text-center text-primary-color">
          <span>Vòng Quay May Mắn</span>
        </h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Quay lại
        </button>
      </div>

      <PrizeBadge prize={prize} className="mb-4" />

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <SpinWheelClient />
      </div>
    </>
  );
}
