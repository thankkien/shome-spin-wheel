"use client";

import { useEffect } from "react";
import { useSpinWheelStore } from "@/stores";
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
  const getSpinStatus = useSpinWheelStore((state) => state.getSpinStatus);
  const getPrizes = useSpinWheelStore((state) => state.getPrizes);

  useEffect(() => {
    getSpinStatus();
  }, []);

  useEffect(() => {
    getPrizes();
  }, []);

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
