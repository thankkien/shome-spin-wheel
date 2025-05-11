"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore, useSpinWheelStore } from "@/stores";
import PrizeBadge from "@/components/PrizeBadge";
import withAuth from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function HomePage() {
  const user = useAuthStore((state) => state.user);
  const hasSpun = useSpinWheelStore((state) => state.hasSpun);
  const fetchSpinStatus = useSpinWheelStore((state) => state.fetchSpinStatus);

  useEffect(() => {
    if (user) {
      fetchSpinStatus(user.id);
    }
  }, [user]);

  return (
    <>
      <PrizeBadge className="mb-6" />

      <Card>
        <CardContent className="p-6">
          <Button
            asChild
            className="w-full h-12"
            variant="default"
          >
            <Link href="/spin-wheel">
          {hasSpun ? "Xem Lại Vòng Quay" : "Vòng Quay May Mắn"}
        </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default withAuth(HomePage);
