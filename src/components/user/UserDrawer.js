"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/app/superuser/useUserStore";
import { RotateCcwKey, ClipboardCopy } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(new RegExp(REGEXP_ONLY_DIGITS), "Mật khẩu phải là 6 số")
    .optional(),
  employeeId: z.string().min(1),
  role: z.enum(["admin", "user"]),
  fullname: z.string().min(1),
  department: z.string().min(1),
});

export function UserDrawer() {
  const { createUser, updateUser, closeForm, toggleForm, user, isOpenForm } =
    useUserStore();

  const form = useForm({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (isOpenForm) {
      form.reset(
        user ?? {
          email: "",
          password: "",
          employeeId: "",
          role: "user",
          fullname: "",
          department: "",
        }
      );
    }
  }, [isOpenForm, user]);

  const onSubmit = async (values) => {
    const submitData = { ...values };
    if (!submitData.password) delete submitData.password;

    const success = user
      ? await updateUser(user.id, submitData)
      : await createUser(submitData);

    if (success) {
      closeForm();
    }
  };

  return (
    <Drawer open={isOpenForm} onOpenChange={toggleForm}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col">
          <DrawerHeader>
            <DrawerTitle>
              {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form className="space-y-4 p-4 overflow-y-auto h-[350px]">
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FormControl style={{ flex: 1 }}>
                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const otp = Math.floor(
                            100000 + Math.random() * 900000
                          ).toString();
                          field.onChange(otp);
                        }}
                      >
                        <RotateCcwKey />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(field.value || "");
                          }
                        }}
                      >
                        <ClipboardCopy />
                      </Button>
                    </div>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
            </form>
          </Form>
          <DrawerFooter>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              {user ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button variant="outline" onClick={() => closeForm()}>
              Hủy
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
