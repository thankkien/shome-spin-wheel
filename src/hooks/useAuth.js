import { useContext } from "react";
import { useStore } from "zustand";
import { AuthStoreContext } from "@/providers/AuthProvider";

export const useAuth = (selector) => {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return useStore(store, selector);
};
