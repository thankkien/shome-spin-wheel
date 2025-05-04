"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function withAuth(Component) {
  const AuthComponent = (props) => {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace("/login");
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };

  const displayName = Component.displayName || Component.name || "Component";
  AuthComponent.displayName = `withAuth(${displayName})`;

  return AuthComponent;
}
