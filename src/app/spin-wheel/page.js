"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSpinWheelStore } from "@/store/useSpinWheelStore";
import { useAuthStore } from "@/store/useAuthStore";
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
  const { isLoggedIn, user, loading: authLoading, spinStatus: authSpinStatus } = useAuthStore();
  const {
    spinStatus,
    fetchSpinStatus,
    isLoading: spinLoading,
    setSpinStatus
  } = useSpinWheelStore();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push("/");
    } else {
      // Nếu đã có dữ liệu từ auth store, sử dụng lại
      if (authSpinStatus) {
        setSpinStatus(authSpinStatus);
        setLocalLoading(false);
      } else {
        // Chỉ gọi API nếu không có dữ liệu
        loadSpinStatus();
      }
    }
  }, [isLoggedIn, user, router, authSpinStatus]);

  const loadSpinStatus = async () => {
    if (!user || !user.id) return;

    setLocalLoading(true);
    await fetchSpinStatus(user.id);
    setLocalLoading(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  if (authLoading || spinLoading || localLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Ưu tiên sử dụng spinStatus từ SpinWheelStore, nếu không có thì dùng authSpinStatus
  const displaySpinStatus = spinStatus || authSpinStatus;

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

      {displaySpinStatus?.hasSpun && displaySpinStatus.prize && (
        <PrizeBadge prize={displaySpinStatus.prize.prize_label} className="mb-4" />
      )}

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <SpinWheelClient
          userId={user?.id}
          hasSpun={displaySpinStatus?.hasSpun || false}
          onSpinComplete={loadSpinStatus}
        />
      </div>
    </>
  );
}
