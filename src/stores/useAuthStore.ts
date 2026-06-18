import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    roleName: string;
    username: string;
    accessToken: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (user: User, token: string) => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,

            setAuth: (user, token) => {
                set({ user, accessToken: token });
                Cookies.set("accessToken", token, { expires: 7 });
            },

            setAccessToken: (token) => {
                set({ accessToken: token });
                Cookies.set("accessToken", token, { expires: 7 });
            },

            setRefreshToken: (token) => {
                set({ refreshToken: token });
            },

            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null });
                Cookies.remove("accessToken");
                localStorage.removeItem("auth-storage");
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);
