'use client';

import { useState, useEffect } from 'react';

import { useUserStore } from '@/stores/useUserStore';

import { UserFilterDrawer } from '@/components/user/UserFilterDrawer';
import { UserTable } from '@/components/user/UserTable';
import { UserModal } from '@/components/user/UserModal';
import withAuth from '@/components/hoc/withAuth';

function SuperuserPage() {
  const { fetchUsers } = useUserStore();
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setModalOpen(true);
  };

  return (
    <>
      <div className="w-full space-y-4">
        <UserTable onEditUser={openEdit} />
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editingUser={editingUser}
        />
        <UserFilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </div>
    </>
  );
}

export default withAuth(SuperuserPage);