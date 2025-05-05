import { useContext } from "react";
import { useStore } from "zustand";
import { SpinWheelStoreContext } from "@/providers/SpinWheelProvider";

export const useSpinWheel = (selector) => {
  const store = useContext(SpinWheelStoreContext);
  if (!store) {
    throw new Error("useSpinWheel phải được sử dụng trong SpinWheelProvider");
  }
  return useStore(store, selector);
};
