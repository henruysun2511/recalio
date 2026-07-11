import { z } from "zod";

export const achievementConditionSchema = z.object({
    type: z.enum(["streak", "reviews", "cards", "xp"]),
    value: z.number().int().min(1),
});

export type AchievementCondition = z.infer<typeof achievementConditionSchema>;

export const createAchievementSchema = z.object({
    key: z.string().min(1, "Key là bắt buộc").max(50),
    name: z.string().min(1, "Tên là bắt buộc").max(100),
    description: z.string().min(1, "Mô tả là bắt buộc").max(500),
    iconUrl: z.string().url().nullable().optional(),
    xpReward: z.number().int().min(0).default(0),
    condition: achievementConditionSchema,
});

export const updateAchievementSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(500).optional(),
    iconUrl: z.string().url().nullable().optional(),
    xpReward: z.number().int().min(0).optional(),
    condition: achievementConditionSchema.optional(),
});

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;

export interface AchievementResponse {
    id: string;
    key: string;
    name: string;
    description: string;
    iconUrl: string | null;
    xpReward: number;
    condition: AchievementCondition;
    createdAt: string;
    updatedAt: string;
}

export const achievementParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    search: z.string().optional(),
});

export type AchievementParams = z.infer<typeof achievementParamsSchema>;