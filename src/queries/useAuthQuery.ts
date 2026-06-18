import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { LoginInput } from "@/schemas/auth.schema";
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
            const { roleName, username, accessToken, refreshToken } = response.data.data;
            const user = { roleName, username, accessToken };
            setAuth(user, accessToken);
            useAuthStore.getState().setRefreshToken(refreshToken);
            Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
            toast.success("Login successful!");
            router.replace("/admin");
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            logout();
            Cookies.remove(ACCESS_TOKEN_KEY);
            router.replace("/auth/login");
        },
        onError: () => {
            logout();
            Cookies.remove(ACCESS_TOKEN_KEY);
            router.replace("/auth/login");
        },
    });
};
