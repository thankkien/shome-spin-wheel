import React from "react";

export function Stack({ children, gap = 2, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-${gap} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function HStack({ children, gap = 2, className = "", ...props }) {
  return (
    <div className={`flex flex-row gap-${gap} ${className}`} {...props}>
      {children}
    </div>
  );
} 