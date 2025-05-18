"use client";

import Link from "next/link";
import { useSpinWheelStore } from "@/stores";
import withAuth from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function HomePage() {
  const hasSpun = useSpinWheelStore((state) => state.hasSpun);

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Button asChild className="w-full h-12" variant="default">
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
