"use client";

import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayout({ children, className }) {
  const pathname = usePathname();
  const isAdminPage = pathname === "/superuser";
  
  return (
    <body
      className={cn(
        isAdminPage ? "w-auto mx-2 my-2" : "min-w-sm max-w-md w-full mx-auto sm:my-2",
        "antialiased flex flex-col min-h-screen",
        "rounded-lg border border-gray-200 shadow-xs",
        className
      )}
    >
      <Header />
      <main className="w-full flex-grow px-2">{children}</main>
      <footer className="flex gap-4 flex-wrap items-center justify-center py-6 text-xs text-muted-foreground mt-auto">
        <p className="flex items-center">
          <span>©</span> Copyright 2025. Công ty TNHH TM S.Home Solution
        </p>
      </footer>
      <Toaster position="top-center" />
    </body>
  );
}
