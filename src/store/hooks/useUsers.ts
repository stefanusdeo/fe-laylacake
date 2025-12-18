import { OutletData } from "@/types/outletTypes";
import { UsersResponse } from "@/types/userTypes";
import { create } from "zustand";

interface UserState {
  users: UsersResponse | null;
  id_user: number | null;
  myOutlet: OutletData[] | null;
  setUsers: (data: UsersResponse) => void;
  setIdUser: (id: number) => void;
  resetUser: () => void;
  setMyOutlet: (data: OutletData[]) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  users: null,
  setUsers: (data: UsersResponse) => set({ users: data }),
  id_user: null,
  setIdUser: (id: number) => set({ id_user: id }),
  resetUser: () => set({ users: null, id_user: null, myOutlet: null }),
  myOutlet: null,
  setMyOutlet: (data: OutletData[]) => set({ myOutlet: data }),
}));
