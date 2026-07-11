import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { refreshApi } from "@/utils/axios";
import { AuthResponse, LoginInput, RefreshTokenInput, RefreshTokenResponse, RegisterInput } from "@/schemas/auth.schema";

const prefix = "/auth";

const authService = {
    login: (data: LoginInput) => {
        return http.post<ApiResponse<AuthResponse>>(`${prefix}/login`, data);
    },

    register: (data: RegisterInput) => {
        return http.post<ApiResponse<AuthResponse>>(`${prefix}/register`, data);
    },

    refreshToken: (data: RefreshTokenInput) => {
        return refreshApi.post<ApiResponse<RefreshTokenResponse>>(`${prefix}/refresh-token`, data);
    },

    logout: (data: { refreshToken: string }) => {
        return http.post<ApiResponse<null>>(`${prefix}/logout`, data);
    },

    changePassword: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        return http.post<ApiResponse<null>>(`${prefix}/change-password`, { currentPassword, newPassword });
    },
};

export default authService;
