import { UsersResponse } from "@/types/userTypes";
import { create } from "zustand";

interface UserState {
  users: UsersResponse | null;
  id_user: number | null;
  setUsers: (data: UsersResponse) => void;
  setIdUser: (id: number) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  users: null,
  setUsers: (data: UsersResponse) => set({ users: data }),
  id_user: null,
  setIdUser: (id: number) => set({ id_user: id }),
  resetUser: () => set({ users: null, id_user: null }),
}));
