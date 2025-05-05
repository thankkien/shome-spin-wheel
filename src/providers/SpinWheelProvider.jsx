"use client";

import { createContext } from "react";
import { spinWheelStore } from "@/store/spinWheelStore";

export const SpinWheelStoreContext = createContext(null);

export const SpinWheelProvider = ({ children }) => {
  return (
    <SpinWheelStoreContext.Provider value={spinWheelStore}>
      {children}
    </SpinWheelStoreContext.Provider>
  );
};
