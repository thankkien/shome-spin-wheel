"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoggedIn(true);
    setError("");
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <header className="py-4">
        <Image
          src="/logo.svg"
          alt="SHome logo"
          width={180}
          height={38}
          priority
        />
      </header>

      <main className="flex flex-col gap-[24px] items-center w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-primary-color">Vòng Quay May Mắn</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Chào mừng đến với Vòng Quay May Mắn nhân dịp sinh nhật lần thứ 7 của
          SHome. Vui lòng đăng nhập để bắt đầu.
        </p>

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="btn-primary rounded-md font-medium h-12 px-5 w-full mt-2"
            >
              Đăng nhập
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-success font-medium">Đăng nhập thành công!</p>
            <Link
              className="btn-primary rounded-md font-medium h-12 px-5 w-full flex items-center justify-center"
              href="/spin-wheel"
            >
              Bắt đầu Vòng Quay May Mắn
            </Link>
          </div>
        )}
      </main>

      <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-gray-500">
        <p className="flex items-center">
          <span>©</span> Copyright 2023. Công ty TNHH TM S.Home Solution
        </p>
      </footer>
    </div>
  );
}
