import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { refreshApi } from "@/utils/axios";
import { AuthResponse, RefreshTokenResponse, ChangePasswordInput, ForgotPasswordInput, VerifyOtpInput, ResetPasswordInput } from "@/schemas/auth.schema";

const prefix = "/auth";

const authService = {
    login: (data: { username: string; password: string }) => {
        return http.post<ApiResponse<AuthResponse>>(`${prefix}/login`, data);
    },

    register: (data: { username: string; email: string; password: string; displayName: string }) => {
        return http.post<ApiResponse<AuthResponse>>(`${prefix}/register`, data);
    },

    refreshToken: (data: { refreshToken: string }) => {
        return refreshApi.post<ApiResponse<RefreshTokenResponse>>(`${prefix}/refresh-token`, data);
    },

    logout: (data: { refreshToken: string }) => {
        return http.post<ApiResponse<null>>(`${prefix}/logout`, data);
    },

    changePassword: (data: ChangePasswordInput) => {
        return http.post<ApiResponse<null>>(`${prefix}/change-password`, data);
    },

    forgotPassword: (data: ForgotPasswordInput) => {
        return http.post<ApiResponse<{ message: string }>>(`${prefix}/forgot-password`, data);
    },

    verifyOtp: (data: VerifyOtpInput) => {
        return http.post<ApiResponse<{ message: string }>>(`${prefix}/verify-otp`, data);
    },

    resetPassword: (data: ResetPasswordInput) => {
        return http.post<ApiResponse<{ message: string }>>(`${prefix}/reset-password`, data);
    },
};

export default authService;
