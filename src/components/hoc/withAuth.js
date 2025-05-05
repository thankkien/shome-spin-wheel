"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
      console.log("withAuth", {user, router, pathname})
      if (!user) {
        router.push("/login");
      } else if (pathname === "/login") {
        router.push("/");
      }
    }, [user, router, pathname]);

    return <Component {...props} />;
  };
}
