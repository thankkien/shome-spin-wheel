"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowDownUp, ArrowDownAZ, ArrowDownZA, ArrowDown10, ArrowDown01, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/app/superuser/useUserStore";
import { UserTableActions } from '@/components/user/UserTableActions';
import { useAuthStore } from '@/stores/useAuthStore';

const SortIcon = ({ column }) => {
  const isNumeric = column.columnDef.meta?.type === 'number';
  const sortDirection = column.getIsSorted();
  const mapping = isNumeric
    ? { asc: ArrowDown10, desc: ArrowDown01 }
    : { asc: ArrowDownAZ, desc: ArrowDownZA };

  const IconComponent = mapping[sortDirection] ?? ArrowDownUp;

  return <IconComponent />;
};

const SortableHeader = ({ column }) => {
  const isSortable = column.getCanSort();
  const label = column.columnDef.meta?.label;
  const needsTruncate = label.length > 15;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={column.getToggleSortingHandler()}
            disabled={!isSortable}
            className={`
              ${isSortable ? 'cursor-pointer' : 'cursor-not-allowed'}
              ${needsTruncate ? 'max-w-[150px]' : ''}
            `}
          >
            <span className={needsTruncate ? 'truncate' : ''}>
              {label}
            </span>
            {isSortable && <SortIcon column={column} className="size-4 ml-1" />}
          </Button>
        </TooltipTrigger>
        {needsTruncate && (
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function UserTable() {
  const {
    users,
    loading,
    pagination,
    setPage,
    selections,
    setSelectedUsers,
    deleteUsers,
    sorting,
    setSorting,
    fields,
    setFields,
    openEditForm,
  } = useUserStore();
  const { user } = useAuthStore();

  const userColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn dòng"
          disabled={user.id === row.original.id}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      meta: { label: "ID" },
      header: ({ column }) => <SortableHeader column={column} />,
    },
    {
      accessorKey: "email",
      meta: { label: "Email" },
      header: ({ column }) => <SortableHeader column={column} />,
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "employeeId",
      meta: { label: "Mã nhân sự" },
      header: ({ column }) => <SortableHeader column={column} />,
    },
    {
      accessorKey: "role",
      meta: { label: "Role" },
      header: ({ column }) => <SortableHeader column={column} />,
    },
    {
      accessorKey: "fullname",
      meta: { label: "Họ tên" },
      header: ({ column }) => <SortableHeader column={column} />,
    },
    {
      accessorKey: "department",
      meta: { label: "Bộ phận" },
      header: ({ column }) => <SortableHeader column={column} />,
    },
    {
      id: "actions",
      meta: { label: "Thao tác" },
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => <SortableHeader column={column} />,
      cell: ({ row }) => {
        const u = row.original;
        return (
          <TooltipProvider>
            <div className="space-x-1 flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditForm(u)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chỉnh sửa</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUsers([u.id])}
                    disabled={user.id === u.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xóa</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: selections,
      sorting,
      pagination,
      columnVisibility: fields,
    },
    onColumnVisibilityChange: (updater) => {
      const fields = table.getState().columnVisibility;
      const updatedFields = typeof updater === 'function'
        ? updater(fields)
        : updater;
      setFields(updatedFields);
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const selectedRowIds = table.getState().rowSelection;
      const updatedRowIds = typeof updater === 'function'
        ? updater(selectedRowIds)
        : updater;
      setSelectedUsers(updatedRowIds);
    },
    manualSorting: true,
    onSortingChange: (updater) => {
      const sorting = table.getState().sorting;
      const updatedSorting = typeof updater === 'function'
        ? updater(sorting)
        : updater;
      setSorting(updatedSorting);
    },
    manualPagination: true,
  });

  return (
    <div className="w-full space-y-2">
      <UserTableActions table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={userColumns.length} className="h-24 text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={userColumns.length}
                  className="h-24 text-center"
                >
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} dòng đã chọn.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pagination.page + 1)}
            disabled={pagination.page * pagination.limit >= pagination.total}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
