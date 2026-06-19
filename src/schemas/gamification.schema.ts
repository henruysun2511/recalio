import { z } from "zod";

export const xpResponseSchema = z.object({
    totalXP: z.number(),
    level: z.number(),
    currentLevelXP: z.number(),
    nextLevelXP: z.number(),
    progressPercent: z.number(),
});

export type XpResponse = z.infer<typeof xpResponseSchema>;

export const achievementSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
    iconUrl: z.string().nullable(),
    xpReward: z.number(),
    earnedAt: z.string().optional(),
});

export type Achievement = z.infer<typeof achievementSchema>;

export const achievementsResponseSchema = z.object({
    unlocked: z.array(achievementSchema),
    locked: z.array(achievementSchema.extend({
        progress: z.object({
            current: z.number(),
            target: z.number(),
        }),
    })),
});

export type AchievementsResponse = z.infer<typeof achievementsResponseSchema>;

export const leaderboardUserSchema = z.object({
    rank: z.number(),
    user: z.object({
        id: z.string().uuid(),
        displayName: z.string(),
        avatarUrl: z.string().nullable(),
    }),
    xp: z.number(),
    level: z.number(),
});

export type LeaderboardUser = z.infer<typeof leaderboardUserSchema>;

export const leaderboardParamsSchema = z.object({
    period: z.enum(["week", "month", "alltime"]).optional(),
    limit: z.coerce.number().optional().default(10),
});

export type LeaderboardParams = z.infer<typeof leaderboardParamsSchema>;
