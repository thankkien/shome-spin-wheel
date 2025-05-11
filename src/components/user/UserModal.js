"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter 
} from "@/components/ui/drawer";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useUserStore } from "@/stores/useUserStore";

const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^\d{6}$/, "Mật khẩu phải là 6 số")
    .optional(),
  employeeId: z.string().min(1),
  role: z.enum(["admin", "user"]),
  fullname: z.string().min(1),
  department: z.string().min(1),
});

export function UserModal({ 
  open, 
  onOpenChange, 
  editingUser 
}) {
  const { createUser, updateUser } = useUserStore();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: editingUser ? {
      ...editingUser,
      password: '', // Always reset password field
    } : {
      email: '',
      password: '',
      employeeId: '',
      role: 'user',
      fullname: '',
      department: '',
    },
  });

  const onSubmit = async (values) => {
    const submitData = { ...values };
    if (!submitData.password) delete submitData.password;

    const success = editingUser 
      ? await updateUser(editingUser.id, submitData)
      : await createUser(submitData);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={editingUser ? 'Để trống nếu không thay đổi' : 'Nhập mật khẩu'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhân sự</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã nhân sự" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bộ phận</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập bộ phận" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter>
              <Button type="submit">
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
