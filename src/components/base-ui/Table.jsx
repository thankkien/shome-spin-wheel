import React from "react";

export default function Table({ children, className = "", ...props }) {
  return (
    <div className={`overflow-x-auto rounded-md border border-gray-200 bg-white ${className}`}>
      <table className="min-w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
} 