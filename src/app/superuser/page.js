"use client";

import { useState, useEffect } from "react";

import { useUserStore } from "./useUserStore";

import { UserTable } from "@/components/user/UserTable";
import { UserDrawer } from "@/components/user/UserDrawer";
import withAuth from "@/components/hoc/withAuth";

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

export default withAuth(SuperuserPage);
