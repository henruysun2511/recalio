import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(100),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    displayName: z.string().min(1, "Display name is required").max(255),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
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
