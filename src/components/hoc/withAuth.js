"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";

export default function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
      const validateAuth = async () => {
        try {
          if (!user) {
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
    }, [pathname, router, user]);

    return <Component {...props} />;
  };
}
