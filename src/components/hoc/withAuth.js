"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";

export default function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);

    useEffect(() => {
      const validateAuth = async () => {
        try {
          if (!hasHydrated) {
            return;
          } else if (!user) {
            router.push("/login");
          } else if (user?.role === "admin") {
            router.push("/superuser");
          } else if (pathname === "/login") {
            router.push("/");
          }
        } catch (error) {
          console.error("Auth validation error:", error);
          router.push("/login");
        }
      };

      validateAuth();
    }, [pathname, router, user, hasHydrated]);

    return <Component {...props} />;
  };
}
