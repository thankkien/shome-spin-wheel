"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => setIsHomePage(["/", "/superuser"].includes(pathname)), [pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/login");
  }, [logout, router]);

  const handleGoHome = useCallback(() => router.push("/"), [router]);

  const renderButton = () => {
    if (isHomePage) {
      return (
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Đăng xuất
        </button>
      );
    }
    if (pathname === "/login") {
      return null;
    }
    return (
      <button
        onClick={handleGoHome}
        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        Quay lại
      </button>
    );
  };

  return (
    <header className="py-4 gap-2 w-full flex flex-col justify-between items-center">
      <Image
        src="/assets/logo.svg"
        alt="SHome logo"
        width={200}
        height={50}
        priority
      />
      <div className="w-full flex justify-between items-center">
        <h1 className="w-full text-2xl font-bold text-center text-yellow-500">
          <span>Chúc Mừng Sinh Nhật 7 tuổi</span>
        </h1>
      </div>
      <div className="w-full flex justify-between items-center mb-6">
        {user ? (
          <p className="text-gray-600 dark:text-gray-300">
            Xin chào, <span className="font-medium">{user.fullname}</span>
          </p>
        ) : (
          <span></span>
        )}
        {renderButton()}
      </div>
    </header>
  );
}
