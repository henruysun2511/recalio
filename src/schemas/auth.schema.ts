import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự").max(100, "Tên đăng nhập tối đa 100 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    displayName: z.string().min(1, "Tên hiển thị không được để trống").max(255, "Tên hiển thị tối đa 255 ký tự"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    otpCode: z.string().length(6, "Mã OTP phải có 6 chữ số"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    otpCode: z.string().length(6, "Mã OTP phải có 6 chữ số"),
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
