import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  color = "teal",
  variant = "solid",
  size = "md",
  ...props
}) {
  // Style đơn giản, có thể mở rộng thêm
  const base =
    "inline-flex items-center justify-center font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const colorMap = {
    teal: {
      solid: "bg-teal-600 text-white hover:bg-teal-700",
      outline: "border border-teal-600 text-teal-600 bg-white hover:bg-teal-50",
    },
    red: {
      solid: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-red-600 text-red-600 bg-white hover:bg-red-50",
    },
    gray: {
      solid: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border border-gray-600 text-gray-600 bg-white hover:bg-gray-50",
    },
  };
  const sizeMap = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
  };
  const colorClass = colorMap[color]?.[variant] || colorMap.teal.solid;
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${colorClass} ${sizeClass} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 