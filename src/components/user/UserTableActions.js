"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileDown, Eye, ChevronDown } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useCallback } from "react";

export function UserTableActions({ table }) {
  const {
    selectedUsers,
    deleteUsers,
    exportUsers,
    openCreateForm,
    fields,
    setSearch,
    searchBy,
    setSearchBy,
  } = useUserStore();

  const searchByOptions = {
    fullname: "Tên",
    employeeId: "Mã nhân viên",
    department: "Phòng ban",
    role: "Vai trò",
  };

  const debouncedSearch = useCallback(debounce(setSearch, 500), [setSearch]);

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => openCreateForm()}>
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
        <Input
          placeholder={`Tìm...`}
          onChange={(event) => debouncedSearch(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ChevronDown className="size-4" />
              <span className="mr-2">{searchByOptions[searchBy]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllLeafColumns()
              .filter((col) => fields[col.id])
              .map((col) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.id === searchBy}
                    onCheckedChange={() => setSearchBy(col.id)}
                  >
                    {col.columnDef.meta?.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Eye className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllLeafColumns()
              .filter((col) => fields[col.id])
              .map((col) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={() =>
                      col.toggleVisibility(!col.getIsVisible())
                    }
                  >
                    {col.columnDef.meta?.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
