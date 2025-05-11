import axios from "@/lib/axios";

export const userService = {
  getAll: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      order,
      'order-by': orderBy,
      search = '',
      'search-by': searchBy,
      fields,
    } = params;

    return await axios.get("/users", {
      params: {
        page,
        limit,
        order,
        "order-by": orderBy,
        search,
        "search-by": searchBy,
        fields,
      },
    });
  },
  create: async (data) => {
    return axios.post("/users", data);
  },
  update: async (id, data) => {
    return axios.patch(`/users/${id}`, data);
  },
  delete: async (ids) => {
    if (Array.isArray(ids)) {
      return axios.delete(`/users`, { params: { ids: ids.join(",") } });
    } else {
      return axios.delete(`/users/${ids}`);
    }
  },
};
