"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSpinWheelStore } from "@/store/useSpinWheelStore";
import { useAuthStore } from "@/store/useAuthStore";
import PrizeBadge from "@/components/PrizeBadge";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, user, logout, fetchUserData, loading, spinStatus: authSpinStatus } = useAuthStore();
  const { setPrize, spinStatus, setSpinStatus } = useSpinWheelStore();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      // Nếu đã có spinStatus trong auth store, sử dụng lại
      if (authSpinStatus) {
        setSpinStatus(authSpinStatus);
        if (authSpinStatus.hasSpun && authSpinStatus.prize) {
          setPrize(authSpinStatus.prize.prize_label);
        }
      } else {
        // Chỉ gọi API nếu chưa có dữ liệu
        loadUserData();
      }
    }
  }, [isLoggedIn, router, authSpinStatus]);

  const loadUserData = async () => {
    setLocalLoading(true);
    const data = await fetchUserData();

    if (data && data.success) {
      // Lưu trạng thái quay
      setSpinStatus(data.spinStatus);

      // Nếu đã quay và có giải thưởng, lưu giải thưởng vào store
      if (data.spinStatus.hasSpun && data.spinStatus.prize) {
        setPrize(data.spinStatus.prize.prize_label);
      }
    }
    setLocalLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Ưu tiên sử dụng spinStatus từ SpinWheelStore, nếu không có thì dùng từ AuthStore
  const displaySpinStatus = spinStatus || authSpinStatus;

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-primary-color">
        <span>Vòng Quay May Mắn</span>
        <p className="text-sm font-light text-center text-gray-500 dark:text-gray-200 mb-4">
          Chào mừng đến với Vòng Quay May Mắn nhân dịp sinh nhật lần thứ 7 của
          SHome.
        </p>
      </h1>

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Xin chào, <span className="font-medium">{user?.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Đăng xuất
          </button>
        </div>

        {displaySpinStatus?.hasSpun && displaySpinStatus.prize ? (
          <PrizeBadge prize={displaySpinStatus.prize.prize_label} className="mb-6" />
        ) : null}

        <Link
          className="btn-primary rounded-md font-medium h-12 px-5 w-full flex items-center justify-center"
          href="/spin-wheel"
        >
          {displaySpinStatus?.hasSpun
            ? "Xem Lại Vòng Quay"
            : "Bắt Đầu Vòng Quay May Mắn"}
        </Link>
      </div>
    </>
  );
}
