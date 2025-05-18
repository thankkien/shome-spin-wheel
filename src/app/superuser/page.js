"use client";

import { useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { UserTable } from "@/components/user/UserTable";
import { UserDrawer } from "@/components/user/UserDrawer";

function SuperuserPage() {
  const { fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <div className="w-full space-y-4">
        <UserTable />
        <UserDrawer />
      </div>
    </>
  );
}

export default SuperuserPage;
