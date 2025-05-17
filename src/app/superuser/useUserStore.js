import { create } from "zustand";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import Papa from "papaparse";
import { useAuthStore } from "@/stores/useAuthStore";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  fields: {
    id: true,
    employeeId: true,
    fullname: true,
    department: true,
    password: true,
    role: true,
  },
  search: "",
  searchBy: "employeeId",
  sorting: [],
  selections: {},
  selectedUsers: [],

  user: null,
  isOpenForm: false,
  closeForm: () => set({ isOpenForm: false, user: null }),
  openCreateForm: () => set({ isOpenForm: true, user: null }),
  openEditForm: (user) => set({ isOpenForm: true, user }),
  toggleForm: () => set((state) => ({ isOpenForm: !state.isOpenForm })),

  fetchUsers: async (params = {}) => {
    set({ loading: true });
    try {
      const state = get();
      const queryParams = {
        page: state.pagination.page,
        limit: state.pagination.limit,
        "order-by": state.sorting[0]?.id,
        order: state.sorting[0]?.desc,
        search: state.search,
        "search-by": state.searchBy,
        fields: Object.keys(state.fields).filter((key) => state.fields[key]),
        ...params,
      };

      const data = await userService.getAll(queryParams);

      if (data.success) {
        set({
          users: data.users || [],
          pagination: {
            ...state.pagination,
            total: data.pagination.total || 0,
          },
        });
      } else {
        toast.error(data.error || "Không thể tải danh sách người dùng");
        set({ users: [] });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Lỗi hệ thống");
      set({ users: [] });
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (search) => {
    set((state) => ({
      search,
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchUsers();
  },

  setSearchBy: (searchBy) => {
    set((state) => ({
      searchBy,
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchUsers();
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchUsers();
  },

  setFields: (newFields) => {
    set((state) => {
      const test = {
        fields: { ...state.fields, ...newFields },
      };
      return test;
    });
    get().fetchUsers();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchUsers();
  },

  setSorting: (sorting) => {
    set((state) => ({
      sorting,
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchUsers();
  },

  setSelectedUsers: (selections) => {
    const authUserId = useAuthStore.getState().user?.id;
    const filterSelections = () => {
      return Object.keys(selections).reduce(
        (acc, idx) => {
          const user = get().users[idx];
          if (user?.id != authUserId) {
            acc.selections[idx] = true;
            acc.selectedUsers.push(user);
          }
          return acc;
        },
        {
          selections: {},
          selectedUsers: [],
        }
      );
    };
    set(filterSelections());
  },

  createUser: async (userData) => {
    try {
      const data = await userService.create(userData);
      if (data.success) {
        toast.success("Thêm user thành công");
        get().fetchUsers();
        return true;
      } else {
        toast.error(data.error);
        return false;
      }
    } catch (e) {
      toast.error(e.error || "Lỗi hệ thống");
      return false;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const data = await userService.update(id, userData);
      if (data.success) {
        toast.success("Cập nhật user thành công");
        get().fetchUsers();
        return true;
      } else {
        toast.error(data.error);
        return false;
      }
    } catch (e) {
      toast.error(e.error || "Lỗi hệ thống");
      return false;
    }
  },

  deleteUsers: async (ids) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const data = await userService.delete(ids);
      if (data.success) {
        toast.success("Đã xóa user");
        get().fetchUsers();
        set({ selectedUsers: [] });
        return true;
      } else {
        toast.error(data.error);
        return false;
      }
    } catch (e) {
      toast.error(e.error || "Lỗi hệ thống");
      return false;
    }
  },

  exportUsers: () => {
    const state = get();
    const filteredUsers = state.users;
    const csv = Papa.unparse(filteredUsers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
}));
