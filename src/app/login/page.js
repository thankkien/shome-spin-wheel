"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, error, clearError, isLoading } = useAuthStore();

  useEffect(() => {
    if (!!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return clearError();
    }

    if (await login(email, password)) {
      router.push("/");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
      >
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Vui lòng đăng nhập để bắt đầu.
        </p>
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary rounded-md font-medium h-12 px-5 w-full mt-2 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
    </>
  );
}
