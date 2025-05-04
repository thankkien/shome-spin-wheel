"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSpinWheelStore } from "@/store/useSpinWheelStore";
import { useAuthStore } from "@/store/useAuthStore";
import PrizeBadge from "@/components/PrizeBadge";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { hasSpun, loading, fetchSpinStatus } = useSpinWheelStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchSpinStatus(user.id);
    }
  }, [user, router, hasSpun]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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

        <PrizeBadge className="mb-6" />

        <Link
          className="btn-primary rounded-md font-medium h-12 px-5 w-full flex items-center justify-center"
          href="/spin-wheel"
        >
          {hasSpun ? "Xem Lại Vòng Quay" : "Bắt Đầu Vòng Quay May Mắn"}
        </Link>
      </div>
    </>
  );
}
