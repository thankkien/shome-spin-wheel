"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSpinWheelStore } from "@/store/useSpinWheelStore";
import { useAuthStore } from "@/store/useAuthStore";
import PrizeBadge from "@/components/PrizeBadge";
import withAuth from "@/components/withAuth";

function HomePage() {
  const { user } = useAuthStore();
  const { hasSpun, fetchSpinStatus } = useSpinWheelStore();

  useEffect(() => {
    if (user) {
      fetchSpinStatus(user.id);
    }
  }, [user, fetchSpinStatus]);

  return (
    <>
      <PrizeBadge className="mb-6" />

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <Link
          className="btn-primary rounded-md font-medium h-12 px-5 w-full flex items-center justify-center"
          href="/spin-wheel"
        >
          {hasSpun ? "Xem Lại Vòng Quay" : "Vòng Quay May Mắn"}
        </Link>
      </div>
    </>
  );
}

export default withAuth(HomePage);
