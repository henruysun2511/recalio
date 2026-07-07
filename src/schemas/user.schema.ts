import { z } from "zod";

export const updateProfileSchema = z.object({
    displayName: z.string().min(1, "Tên hiển thị không được để trống").max(255, "Tên hiển thị tối đa 255 ký tự").optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().url("URL không hợp lệ").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateRoleSchema = z.object({
    role: z.string().min(1, "Vai trò không được để trống"),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

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

export interface UserListResponse {
    users: UserProfile[];
    total: number;
    page: number;
    limit: number;
}
