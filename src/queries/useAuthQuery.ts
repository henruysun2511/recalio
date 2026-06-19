import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
import { handleError } from "@/utils/handleError";
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

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
            toast.success("Login successful!");
            router.replace("/admin/overview");
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (data: RegisterInput) => authService.register(data),
        onSuccess: (response) => {
            const { accessToken, refreshToken, user } = response.data.data;
            setAuth(user, accessToken);
            useAuthStore.getState().setRefreshToken(refreshToken);
            Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
            toast.success("Registration successful!");
            router.replace("/admin/overview");
        },
        onError: (error) => {
            handleError(error, "Registration failed");
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
