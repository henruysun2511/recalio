import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { refreshApi } from "@/utils/axios";
import { AuthResponse, LoginInput } from "@/schemas/auth.schema";

const prefix = "/auth";

const authService = {
    login: (data: LoginInput) => {
        return http.post<ApiResponse<AuthResponse>>(`${prefix}/login`, data);
    },

    logout: () => {
        return http.post<ApiResponse<null>>(`${prefix}/logout`);
    },

    refreshToken: () => {
        return refreshApi.post<ApiResponse<{ accessToken: string }>>(`${prefix}/refresh-token`);
    },
};

export default authService;
