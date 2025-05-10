import React from "react";
import { tv } from "tailwind-variants";

const box = tv({
  base: "",
  variants: {
    padding: {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
    rounded: {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
    },
    shadow: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    },
  },
  defaultVariants: {
    padding: "none",
    rounded: "none",
    shadow: "none",
  },
});

export default function Box({ 
  children, 
  className = "", 
  style = {}, 
  padding,
  rounded,
  shadow,
  ...props 
}) {
  return (
    <div 
      className={box({ padding, rounded, shadow, className })} 
      style={style} 
      {...props}
    >
      {children}
    </div>
  );
} 