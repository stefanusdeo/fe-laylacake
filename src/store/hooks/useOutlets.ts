import { OutletsResponse } from "@/types/outletTypes";
import { create } from "zustand";

interface OutletState {
  outletExternal: OutletsResponse | null;
  outletInternal: OutletsResponse | null;
  setOutletExternal: (data: OutletsResponse) => void;
  setOutletInternal: (data: OutletsResponse) => void;
}

export const useOutletStore = create<OutletState>()((set) => ({
  outletExternal: null,
  outletInternal: null,
  setOutletExternal: (data: OutletsResponse) => set({ outletExternal: data }),
  setOutletInternal: (data: OutletsResponse) => set({ outletInternal: data }),
}));
