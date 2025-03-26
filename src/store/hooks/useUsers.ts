import { UsersResponse } from "@/types/userTypes";
import { create } from "zustand";

interface UserState {
  users: UsersResponse | null;
  setUsers: (data: UsersResponse) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  users: null,
  setUsers: (data: UsersResponse) => set({ users: data }),
}));
