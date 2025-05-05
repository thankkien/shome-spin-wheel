"use client";

import { createContext } from "react";
import { authStore } from "@/stores/authStore";

export const AuthStoreContext = createContext(null);

export const AuthProvider = ({ children }) => {
  return (
    <AuthStoreContext.Provider value={authStore}>
      {children}
    </AuthStoreContext.Provider>
  );
};
