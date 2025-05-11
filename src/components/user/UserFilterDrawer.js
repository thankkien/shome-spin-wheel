"use client";

import { Input } from "@/components/ui/input";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle 
} from "@/components/ui/drawer";
import { useUserStore } from "@/stores/useUserStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserFilterDrawer({ open, onOpenChange }) {
  const { filters, setFilters } = useUserStore();

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-auto max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Bộ lọc</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <Input
              placeholder="Lọc email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
            <Input
              placeholder="Lọc mã nhân sự"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
            />
            <Input
              placeholder="Lọc họ tên"
              value={filters.fullname}
              onChange={(e) => handleFilterChange('fullname', e.target.value)}
            />
            <Select 
              value={filters.role?.[0] || ''} 
              onValueChange={(value) => handleFilterChange('role', value ? [value] : [])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Lọc bộ phận"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
