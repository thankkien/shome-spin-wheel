import React from "react";
import { tv } from "tailwind-variants";

const stack = tv({
  base: "flex",
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: 2,
    align: "stretch",
    justify: "start",
  },
});

export function Stack({ 
  children, 
  gap = 2, 
  className = "", 
  direction = "vertical",
  align,
  justify,
  ...props 
}) {
  return (
    <div 
      className={stack({ direction, gap, align, justify, className })} 
      {...props}
    >
      {children}
    </div>
  );
}

export function HStack({ 
  children, 
  gap = 2, 
  className = "", 
  align,
  justify,
  ...props 
}) {
  return (
    <div 
      className={stack({ direction: "horizontal", gap, align, justify, className })} 
      {...props}
    >
      {children}
    </div>
  );
} 