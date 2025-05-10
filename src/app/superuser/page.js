"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, FileDown, Edit2, KeyRound } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS
} from "@/components/ui/input-otp";

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

function filterUsers(users, filters) {
  return users.filter((u) =>
    Object.entries(filters).every(([key, value]) => {
      if (key === "role") {
        return value.length === 0 || value.includes(u[key]);
      }
      return value
        ? String(u[key] || "")
            .toLowerCase()
            .includes(value.toLowerCase())
        : true;
    })
  );
}

export default function SuperuserPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    employeeId: "",
    role: [],
    fullname: "",
    department: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      employeeId: "",
      role: "user",
      fullname: "",
      department: "",
    },
  });

  // Bảo vệ route: chỉ cho phép admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      toast.error("Bạn không có quyền truy cập");
      router.replace("/");
    }
  }, [user, router]);

  // Lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
    else toast.error(data.error);
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc user
  const filteredUsers = useMemo(
    () => filterUsers(users, filters),
    [users, filters]
  );

  const openAdd = () => {
    setEditingUser(null);
    form.reset({ role: "user" });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    form.reset({ ...u, password: "" });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onSubmit = async (values) => {
    try {
      let res;
      if (editingUser) {
        const patchData = { ...values };
        if (!patchData.password) delete patchData.password;
        res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchData),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }
      const data = await res.json();
      if (data.success) {
        toast.success(
          editingUser ? "Cập nhật thành công" : "Thêm user thành công"
        );
        fetchUsers();
        closeModal();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error("Lỗi hệ thống");
    }
  };

  const handleDelete = async (ids) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    let url = Array.isArray(ids)
      ? `/api/users?ids=${ids.join(",")}`
      : `/api/users/${ids}`;
    let method = Array.isArray(ids) ? "DELETE" : "DELETE";
    const res = await fetch(url, { method });
    const data = await res.json();
    if (data.success) {
      toast.success("Đã xóa user");
      fetchUsers();
      setSelected([]);
    } else {
      toast.error(data.error);
    }
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredUsers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateRandomPin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm("Bạn chắc chắn muốn reset mật khẩu?")) return;
    try {
      const newPassword = generateRandomPin();
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Mật khẩu mới: ${newPassword}`);
        fetchUsers();
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="max-w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm user
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(selected)}
            disabled={!selected.length}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đã chọn
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="mb-4 py-0 ">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <Input
              placeholder="Lọc email"
              value={filters.email}
              onChange={(e) =>
                setFilters((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              placeholder="Lọc mã nhân sự"
              value={filters.employeeId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, employeeId: e.target.value }))
              }
            />
            <Input
              placeholder="Lọc họ tên"
              value={filters.fullname}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fullname: e.target.value }))
              }
            />
            <Input
              placeholder="Lọc bộ phận"
              value={filters.department}
              onChange={(e) =>
                setFilters((f) => ({ ...f, department: e.target.value }))
              }
            />
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Lọc role</div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="role-admin"
                    checked={filters.role.includes("admin")}
                    onCheckedChange={(checked) => {
                      setFilters((f) => ({
                        ...f,
                        role: checked
                          ? [...f.role, "admin"]
                          : f.role.filter((r) => r !== "admin"),
                      }));
                    }}
                  />
                  <label
                    htmlFor="role-admin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Admin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="role-user"
                    checked={filters.role.includes("user")}
                    onCheckedChange={(checked) => {
                      setFilters((f) => ({
                        ...f,
                        role: checked
                          ? [...f.role, "user"]
                          : f.role.filter((r) => r !== "user"),
                      }));
                    }}
                  />
                  <label
                    htmlFor="role-user"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    User
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="p-0">
          <Table className="[&_th]:border-0 [&_td]:border-0">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredUsers.length > 0 &&
                      selected.length === filteredUsers.length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(filteredUsers.map((u) => u.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                    aria-label="Chọn tất cả"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Bộ phận</TableHead>
                <TableHead>Mật khẩu</TableHead>
                <TableHead className="w-[100px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Không có user nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className={
                      selected.includes(u.id) ? "bg-muted/50" : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(u.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelected([...selected, u.id]);
                          } else {
                            setSelected(selected.filter((id) => id !== u.id));
                          }
                        }}
                        aria-label={`Chọn ${u.fullname}`}
                      />
                    </TableCell>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.employeeId}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.fullname}</TableCell>
                    <TableCell>{u.department}</TableCell>
                    <TableCell>{u.password}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(u)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete([u.id])}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Drawer open={modalOpen} onOpenChange={setModalOpen}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{editingUser ? "Sửa user" : "Thêm user"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!!editingUser} />
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
                      <FormLabel>
                        {editingUser
                          ? "Mật khẩu mới (bỏ qua nếu không đổi)"
                          : "Mật khẩu"}
                      </FormLabel>
                      <div className="flex gap-2 items-start">
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            pattern={REGEXP_ONLY_DIGITS}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newPassword = generateRandomPin();
                            field.onChange(newPassword);
                          }}
                        >
                          <KeyRound className="w-4 h-4" />
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
                        <Input {...field} />
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
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">user</SelectItem>
                          <SelectItem value="admin">admin</SelectItem>
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
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DrawerFooter className="sticky bottom-0 bg-background border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingUser ? "Lưu" : "Thêm"}
                  </Button>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
