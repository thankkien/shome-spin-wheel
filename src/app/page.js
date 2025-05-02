"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore, useSpinWheelStore } from "@/store";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, user, error, login, clearError } = useAuthStore();
  const { prize } = useSpinWheelStore();



  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, error, clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-primary-color">
        <span>Vòng Quay May Mắn</span>
        <p className="text-sm font-light text-center text-gray-500 dark:text-gray-200 mb-4">
          Chào mừng đến với Vòng Quay May Mắn nhân dịp sinh nhật lần thứ 7 của
          SHome.
        </p>
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        {user ? (
          <span>Hi, {user.email}</span>
        ) : (
          <span>Vui lòng đăng nhập để bắt đầu.</span>
        )}
      </p>

      {!isLoggedIn ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            className="btn-primary rounded-md font-medium h-12 px-5 w-full mt-2"
          >
            Đăng nhập
          </button>
        </form>
      ) : (
        <Link
          className="btn-primary rounded-md font-medium h-12 px-5 w-full flex items-center justify-center"
          href="/spin-wheel"
        >
          Bắt Đầu Vòng Quay May Mắn
        </Link>
      )}
    </>
  );
}
