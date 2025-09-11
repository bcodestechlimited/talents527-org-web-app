import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().user,
    }),
    {
      name: "org-store",
    }
  )
);
