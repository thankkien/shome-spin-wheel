import React from "react";
import { tv } from "tailwind-variants";

const table = tv({
  base: "overflow-x-auto rounded-md border border-gray-200 bg-white",
  variants: {
    variant: {
      default: "",
      striped: "[&>table>tbody>tr:nth-child(odd)]:bg-gray-50",
      bordered: "[&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-200",
    },
    size: {
      sm: "[&>table]:text-xs",
      md: "[&>table]:text-sm",
      lg: "[&>table]:text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export default function Table({ 
  children, 
  className = "", 
  variant,
  size,
  ...props 
}) {
  return (
    <div className={table({ variant, size, className })} {...props}>
      <table className="min-w-full text-left">
        {children}
      </table>
    </div>
  );
} 