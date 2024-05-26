import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

export type AuthState = {
  isLogged: boolean;
  username: string;
  accessToken: string;
  refreshToken: string;
  login: ({}: {
    username: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
};

const createAuthStore: StateCreator<AuthState> = (set) => ({
  isLogged: false,
  username: "",
  accessToken: "",
  refreshToken: "",
  login: ({ username, accessToken, refreshToken }) =>
    set({ isLogged: true, username, accessToken, refreshToken }),
  logout: () => {
    set({ isLogged: false, username: "", accessToken: "", refreshToken: "" });
  },
});

export const authStoreKey = "auth-storage";
export const useAuthStore = create<AuthState>(
  persist(createAuthStore, {
    name: authStoreKey,
  }) as any,
);
