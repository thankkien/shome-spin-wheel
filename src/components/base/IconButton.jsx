import React from "react";
import { tv } from "tailwind-variants";

const iconButton = tv({
  base: "inline-flex items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    color: {
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
    },
    size: {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
    },
    disabled: {
      true: "opacity-60 cursor-not-allowed",
    },
  },
  defaultVariants: {
    color: "teal",
    variant: "solid",
    size: "md",
  },
});

export default function IconButton({
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
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={iconButton({ color, variant, size, disabled, className })}
      {...props}
    >
      {children}
    </button>
  );
} 