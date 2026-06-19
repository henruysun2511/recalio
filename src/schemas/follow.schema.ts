import { SortOrder } from "@/constants/sort";
import { z } from "zod";

export const followUserSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    followedAt: z.string(),
});

export type FollowUser = z.infer<typeof followUserSchema>;

export const followParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    sortOrder: z.enum([SortOrder.DESC, SortOrder.ASC]).optional().default(SortOrder.DESC),
});

export type FollowParams = z.infer<typeof followParamsSchema>;

export interface FollowStatus {
    isFollowing: boolean;
}
