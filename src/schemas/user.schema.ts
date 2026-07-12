import { z } from "zod";

export const updateProfileSchema = z.object({
    displayName: z.string().min(1, "Tên hiển thị không được để trống").max(255, "Tên hiển thị tối đa 255 ký tự").optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().url("URL không hợp lệ").optional(),
    timezone: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateRoleSchema = z.object({
    role: z.string().min(1, "Vai trò không được để trống"),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export interface UserStats {
    totalCards: number;
    totalReviews: number;
    totalStudyTimeMs: number;
    totalStudyDays: number;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
    timezone?: string;
    createdAt: string;
    updatedAt?: string;
    stats?: UserStats;
    followerCount: number;
    followingCount: number;
}

export interface PublicProfile {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    stats: UserStats;
    followerCount: number;
    followingCount: number;
}

export interface UserQuery {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface UserLanguage {
    id: string;
    userId: string;
    languageId: string;
    isActive: boolean;
    startedAt: string;
    language: {
        id: string;
        name: string;
        nativeName: string;
        flagEmoji: string;
    };
}

export interface UserListResponse {
    users: UserProfile[];
    total: number;
    page: number;
    limit: number;
}
