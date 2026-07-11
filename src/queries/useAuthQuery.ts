import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { ChangePasswordInput, LoginInput, RegisterInput } from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { UserRole } from "@/constants/type";

export const AUTH_QUERY_KEY = ["auth"];
const ACCESS_TOKEN_KEY = "accessToken";

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordInput) => authService.changePassword(data),
    });
};

export const useLogin = () => {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (data: LoginInput) => authService.login(data),
        onSuccess: (response) => {
            const { accessToken, refreshToken, user } = response.data.data;
            setAuth(user, accessToken);
            useAuthStore.getState().setRefreshToken(refreshToken);
            Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
            if (user.role === UserRole.ADMIN) {
                router.replace("/admin/overview");
            } else {
                router.replace("/overview");
            }
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (data: RegisterInput) => authService.register(data),
        onSuccess: () => {
            router.replace("/auth/login");
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const { logout: storeLogout } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout({ refreshToken: useAuthStore.getState().refreshToken || "" }),
        onSuccess: () => {
            storeLogout();
            Cookies.remove(ACCESS_TOKEN_KEY);
            router.replace("/auth/login");
        },
        onError: () => {
            storeLogout();
            Cookies.remove(ACCESS_TOKEN_KEY);
            router.replace("/auth/login");
        },
    });
};
