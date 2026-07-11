import { z } from "zod";
import { DeckSortBy, SortOrder } from "@/constants/sort";

export const deckSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string(),
    fullPath: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    isArchived: z.boolean(),
    isPublic: z.boolean(),
    tags: z.array(z.string()).optional(),
    downloadCount: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Deck = z.infer<typeof deckSchema>;

export const deckParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    search: z.string().optional(),
    sortOrder: z.enum([SortOrder.DESC, SortOrder.ASC]).optional().default(SortOrder.DESC),
    sort: z.enum([DeckSortBy.NAME, DeckSortBy.CREATED_AT, DeckSortBy.DOWNLOAD_COUNT]).optional().default(DeckSortBy.CREATED_AT),
    isPublic: z.coerce.boolean().optional(),
    userId: z.string().optional(),
});

export type DeckParams = z.infer<typeof deckParamsSchema>;

export const createDeckSchema = z.object({
    name: z.string().min(1, "Tên bộ thẻ không được để trống").max(255, "Tên bộ thẻ tối đa 255 ký tự"),
    fullPath: z.string().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    parentId: z.string().uuid().optional(),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;

export const updateDeckSchema = z.object({
    name: z.string().min(1, "Tên bộ thẻ không được để trống").max(255, "Tên bộ thẻ tối đa 255 ký tự").optional(),
    fullPath: z.string().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    isPublic: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export interface DeckResponse {
    id: string;
    userId: string;
    name: string;
    fullPath: string | null;
    description: string | null;
    coverImage: string | null;
    isArchived: boolean;
    isPublic: boolean;
    isBanned: boolean;
    isFeatured: boolean;
    tags: string[];
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        username: string;
        displayName: string;
        avatarUrl: string | null;
    };
    _count?: {
        notes: number;
        cards: number;
    };
    averageRating?: number;
    ratingCount?: number;
    progress?: {
        dueCards: number;
        totalReviews: number;
        retentionRate: number;
    };
}
