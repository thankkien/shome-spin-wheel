"use client";

import { useEffect } from "react";
import { useAuth, useSpinWheel } from "@/hooks";
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
  const user = useAuth((state) => state.user);
  const fetchSpinStatus = useSpinWheel((state) => state.fetchSpinStatus);

  useEffect(() => {
    if (user) {
      fetchSpinStatus(user.id);
    }
  }, [user]);

  return (
    <>
      <PrizeBadge className="mb-4" />

      <Card>
        <CardContent className="p-6">
        <SpinWheelClient />
        </CardContent>
      </Card>
    </>
  );
}

export default withAuth(SpinWheelPage);
