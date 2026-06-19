import { SortOrder, ReviewSortBy } from "@/constants/sort";
import { z } from "zod";

export const reviewSchema = z.object({
    id: z.string().uuid(),
    deckId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    user: z.object({
        id: z.string().uuid(),
        username: z.string(),
        displayName: z.string(),
        avatarUrl: z.string().nullable(),
    }).optional(),
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    sortOrder: z.enum([SortOrder.DESC, SortOrder.ASC]).optional().default(SortOrder.DESC),
    sortBy: z.enum([ReviewSortBy.CREATED_AT, ReviewSortBy.RATING]).optional().default(ReviewSortBy.CREATED_AT),
});

export type ReviewParams = z.infer<typeof reviewParamsSchema>;

export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
