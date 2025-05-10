"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Table,
  Box,
  Stack,
  HStack,
  Spinner,
  IconButton,
} from "@/components/base";
import { AddIcon, DeleteIcon, EditIcon, DownloadIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { authStore } from "@/stores/authStore";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  employeeId: z.string().min(1),
  role: z.enum(["admin", "user"]),
  fullname: z.string().min(1),
  department: z.string().min(1),
});

function filterUsers(users, filters) {
  return users.filter((u) =>
    Object.entries(filters).every(([key, value]) =>
      value
        ? String(u[key] || "")
            .toLowerCase()
            .includes(value.toLowerCase())
        : true
    )
  );
}

export default function SuperuserPage() {
  const router = useRouter();
  const { user } = authStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    employeeId: "",
    role: "",
    fullname: "",
    department: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Bảo vệ route: chỉ cho phép admin
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      setToastMsg("Bạn không có quyền truy cập");
      router.replace("/");
    }
  }, [user, router]);

  // Lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.users);
    else setToastMsg(data.error);
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

  // Thêm/sửa user
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(userSchema) });

  const openAdd = () => {
    setEditingUser(null);
    reset({ role: "user" });
    setModalOpen(true);
  };
  const openEdit = (u) => {
    setEditingUser(u);
    reset({ ...u, password: "" });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (values) => {
    try {
      let res;
      if (editingUser) {
        // PATCH
        const patchData = { ...values };
        if (!patchData.password) delete patchData.password;
        res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchData),
        });
      } else {
        // POST
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }
      const data = await res.json();
      if (data.success) {
        setToastMsg(editingUser ? "Cập nhật thành công" : "Thêm user thành công");
        fetchUsers();
        closeModal();
      } else {
        setToastMsg(data.error);
      }
    } catch (e) {
      setToastMsg("Lỗi hệ thống");
    }
  };

  // Xóa user
  const handleDelete = async (ids) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    let url = Array.isArray(ids)
      ? `/api/users?ids=${ids.join(",")}`
      : `/api/users/${ids}`;
    let method = Array.isArray(ids) ? "DELETE" : "DELETE";
    const res = await fetch(url, { method });
    const data = await res.json();
    if (data.success) {
      setToastMsg("Đã xóa user");
      fetchUsers();
      setSelected([]);
    } else {
      setToastMsg(data.error);
    }
  };

  // Export CSV
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

  // Chọn nhiều user
  const toggleSelect = (id) =>
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]
    );
  const selectAll = () => setSelected(filteredUsers.map((u) => u.id));
  const deselectAll = () => setSelected([]);

  return (
    <Box className="max-w-full p-4">
      <HStack gap={4} className="mb-4 justify-between">
        <HStack gap={2}>
          <Button color="teal" onClick={openAdd}>
            Thêm user
          </Button>
          <Button color="red" onClick={() => handleDelete(selected)} disabled={!selected.length}>
            Xóa đã chọn
          </Button>
          <Button color="gray" onClick={handleExport}>
            Export CSV
          </Button>
        </HStack>
        <HStack gap={2}>
          <Button size="sm" onClick={selectAll}>
            Chọn tất cả
          </Button>
          <Button size="sm" onClick={deselectAll}>
            Bỏ chọn
          </Button>
        </HStack>
      </HStack>
      <Stack gap={2} className="mb-2 md:flex-row flex-col">
        <input
          className="border rounded px-2 py-1"
          placeholder="Lọc email"
          value={filters.email}
          onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Lọc employeeId"
          value={filters.employeeId}
          onChange={(e) => setFilters((f) => ({ ...f, employeeId: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Lọc họ tên"
          value={filters.fullname}
          onChange={(e) => setFilters((f) => ({ ...f, fullname: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Lọc bộ phận"
          value={filters.department}
          onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
        />
        <select
          className="border rounded px-2 py-1"
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="">Lọc role</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
      </Stack>
      <Table>
        <thead className="bg-gray-100">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
              />
            </th>
            <th>ID</th>
            <th>Email</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Họ tên</th>
            <th>Bộ phận</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">
                Không có user nào
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr key={u.id} className={selected.includes(u.id) ? "bg-gray-50" : undefined}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.employeeId}</td>
                <td>{u.role}</td>
                <td>{u.fullname}</td>
                <td>{u.department}</td>
                <td>
                  <HStack gap={1}>
                    <IconButton color="gray" size="sm" onClick={() => openEdit(u)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="red" size="sm" onClick={() => handleDelete([u.id])}>
                      <DeleteIcon />
                    </IconButton>
                  </HStack>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {/* Modal thêm/sửa user */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">{editingUser ? "Sửa user" : "Thêm user"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={3}>
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    {...register("email")}
                    autoComplete="off"
                    disabled={!!editingUser}
                  />
                  {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}
                </div>
                <div>
                  <label className="block font-medium">{editingUser ? "Mật khẩu mới (bỏ qua nếu không đổi)" : "Mật khẩu"}</label>
                  <input
                    type="password"
                    className="border rounded px-2 py-1 w-full"
                    {...register("password")}
                    autoComplete="new-password"
                  />
                  {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}
                </div>
                <div>
                  <label className="block font-medium">Employee ID</label>
                  <input className="border rounded px-2 py-1 w-full" {...register("employeeId")}/>
                  {errors.employeeId && <div className="text-red-500 text-xs">{errors.employeeId.message}</div>}
                </div>
                <div>
                  <label className="block font-medium">Role</label>
                  <select className="border rounded px-2 py-1 w-full" {...register("role")}> <option value="user">user</option> <option value="admin">admin</option> </select>
                  {errors.role && <div className="text-red-500 text-xs">{errors.role.message}</div>}
                </div>
                <div>
                  <label className="block font-medium">Họ tên</label>
                  <input className="border rounded px-2 py-1 w-full" {...register("fullname")}/>
                  {errors.fullname && <div className="text-red-500 text-xs">{errors.fullname.message}</div>}
                </div>
                <div>
                  <label className="block font-medium">Bộ phận</label>
                  <input className="border rounded px-2 py-1 w-full" {...register("department")}/>
                  {errors.department && <div className="text-red-500 text-xs">{errors.department.message}</div>}
                </div>
              </Stack>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" onClick={closeModal}>Hủy</Button>
                <Button color="teal" type="submit" disabled={isSubmitting}>{editingUser ? "Lưu" : "Thêm"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast message */}
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50" onClick={() => setToastMsg("")}>{toastMsg}</div>
      )}
    </Box>
  );
}
