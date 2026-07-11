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

export const studyCalendarEntrySchema = z.object({
    date: z.string(),
    count: z.number(),
});
export type StudyCalendarEntry = z.infer<typeof studyCalendarEntrySchema>;

export const studyCalendarParamsSchema = z.object({
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
});
export type StudyCalendarParams = z.infer<typeof studyCalendarParamsSchema>;

export const studyStreakSchema = z.object({
    currentStreak: z.number(),
    longestStreak: z.number(),
});
export type StudyStreak = z.infer<typeof studyStreakSchema>;

export const avgResponseTimeSchema = z.object({
    again: z.number(),
    hard: z.number(),
    good: z.number(),
    easy: z.number(),
});
export type AvgResponseTime = z.infer<typeof avgResponseTimeSchema>;

export const reviewStatsSchema = z.object({
    retentionRate: z.number(),
    avgResponseTime: avgResponseTimeSchema,
});
export type ReviewStats = z.infer<typeof reviewStatsSchema>;

export const dailyGoalSchema = z.object({
    targetReviews: z.number(),
    targetNewCards: z.number(),
});
export type DailyGoal = z.infer<typeof dailyGoalSchema>;

export const updateDailyGoalSchema = z.object({
    targetReviews: z.number().int().min(1).optional(),
    targetNewCards: z.number().int().min(1).optional(),
});
export type UpdateDailyGoalInput = z.infer<typeof updateDailyGoalSchema>;
