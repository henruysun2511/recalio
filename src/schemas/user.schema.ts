import { z } from "zod";

export const updateProfileSchema = z.object({
    displayName: z.string().min(1).max(255).optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
