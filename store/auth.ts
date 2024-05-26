import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "@/client";
import { authStoreKey } from "@/constants";

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
  setUsername: (username: string) => void;
};

const createAuthStore: StateCreator<AuthState> = (set) => ({
  isLogged: false,
  username: "",
  accessToken: "",
  refreshToken: "",
  login: ({ username, accessToken, refreshToken }) => {
    axiosInstance.defaults.headers.authorization = `Bearer ${accessToken}`;
    set({ isLogged: true, username, accessToken, refreshToken });
  },
  logout: () => {
    set({ isLogged: false, username: "", accessToken: "", refreshToken: "" });
  },
  setUsername: (username) => set({ username }),
});

export const useAuthStore = create<AuthState>(
  persist(createAuthStore, {
    name: authStoreKey,
  }) as any,
);
