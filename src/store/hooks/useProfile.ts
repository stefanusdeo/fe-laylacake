import { IProfile } from "@/types/profileTypes";
import { create } from "zustand";

interface ProfileState {
  profile: IProfile | null;
  setProfile: (profile: IProfile) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  setProfile: (profile: IProfile) => set({ profile }),
}));
