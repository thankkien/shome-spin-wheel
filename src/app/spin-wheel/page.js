"use client";

import { useEffect } from "react";
import { useAuthStore, useSpinWheelStore } from "@/stores";
import dynamic from "next/dynamic";
import PrizeBadge from "@/components/PrizeBadge";
import withAuth from "@/components/hoc/withAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SpinWheelClient = dynamic(() => import("@/components/SpinWheel"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg mx-auto mb-6 h-[500px] flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

function SpinWheelPage() {
  const user = useAuthStore((state) => state.user);
  const fetchSpinStatus = useSpinWheelStore((state) => state.fetchSpinStatus);

  useEffect(() => {
    if (user) {
      fetchSpinStatus(user.id);
    }
  }, [user]);

  return (
    <>
      <PrizeBadge className="mb-4 p-0" />
      <Card>
        <CardContent>
          <SpinWheelClient />
        </CardContent>
      </Card>
    </>
  );
}

export default withAuth(SpinWheelPage);
