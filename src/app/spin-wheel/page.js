"use client";

import { useEffect } from "react";
import { useSpinWheelStore } from "@/store/useSpinWheelStore";
import { useAuth } from "@/hooks/useAuth";
import dynamic from "next/dynamic";
import PrizeBadge from "@/components/PrizeBadge";
import withAuth from "@/components/hoc/withAuth";

const SpinWheelClient = dynamic(() => import("@/components/SpinWheel"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg mx-auto mb-6 h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p className="text-xl">Đang tải vòng quay...</p>
    </div>
  ),
});

function SpinWheelPage() {
  const { user } = useAuth();
  const { fetchSpinStatus } = useSpinWheelStore();

  useEffect(() => {
    if (user) {
      fetchSpinStatus(user.id);
    }
  }, [user]);

  return (
    <>
      <PrizeBadge className="mb-4" />

      <div className="w-full bg-card p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <SpinWheelClient />
      </div>
    </>
  );
}

export default withAuth(SpinWheelPage);
