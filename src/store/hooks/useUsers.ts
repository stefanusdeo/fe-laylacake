import { UsersResponse } from "@/types/userTypes";
import { create } from "zustand";
import { set } from "react-hook-form";

interface UserState {
  users: UsersResponse | null;
  id_user: number | null;
  setUsers: (data: UsersResponse) => void;
  setIdUser: (id: number) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  users: null,
  setUsers: (data: UsersResponse) => set({ users: data }),
  id_user: null,
  setIdUser: (id: number) => set({ id_user: id }),
}));
