"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileDown } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 

export function UserTableActions({
  table,
  onOpenAddModal,
}) {
  const selectedUsers = useUserStore((state) => state.selectedUsers);
  const deleteUsers = useUserStore((state) => state.deleteUsers);
  const exportUsers = useUserStore((state) => state.exportUsers);
console.log(selectedUsers)
  return (<>
    <div className="flex gap-2">
      <Button onClick={onOpenAddModal}>
        <Plus className="size-4" />
        <span className="mr-2">Thêm mới</span>
      </Button>
      <Button
        variant="destructive"
        onClick={() => deleteUsers(selectedUsers)}
        disabled={!Object.keys(selectedUsers).length}
      >
        <Trash2 className="size-4" />
        <span className="mr-2">Xóa</span>
      </Button>
      <Button variant="outline" onClick={exportUsers}>
        <FileDown className="size-4" />
        <span className="mr-2">Tải về</span>
      </Button>
    </div>
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Cột</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {table.getAllLeafColumns()
            .reduce((acc, col) => {
              const blackList = ['select', 'actions'];
              if (col.columnDef.meta?.label && !blackList.includes(col.id)) {
                acc.push(
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={() => col.toggleVisibility(!col.getIsVisible())}
                  >
                    {col.columnDef.meta?.label}
                  </DropdownMenuCheckboxItem>
                );
              }
              return acc;
            }, [])}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </>
  );
}
