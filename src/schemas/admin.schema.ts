import { z } from "zod"

export const recentReportSchema = z.object({
    id: z.string(),
    reason: z.string(),
    createdAt: z.string(),
    deck: z.object({ id: z.string(), name: z.string() }),
    reportedBy: z.object({
        id: z.string(),
        username: z.string(),
        displayName: z.string(),
        avatarUrl: z.string().nullable(),
    }),
})

export const recentUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayName: z.string(),
    email: z.string(),
    avatarUrl: z.string().nullable(),
    createdAt: z.string(),
})

export const growthPointSchema = z.object({
    date: z.string(),
    count: z.number(),
})

export const dashboardSchema = z.object({
    totalUsers: z.number(),
    newUsersToday: z.number(),
    totalDecks: z.number(),
    publicDecks: z.number(),
    totalReviews: z.number(),
    reviewsToday: z.number(),
    pendingReports: z.number(),
    recentReports: z.array(recentReportSchema),
    recentUsers: z.array(recentUserSchema),
    userGrowth: z.array(growthPointSchema),
    reviewCounts: z.array(growthPointSchema),
})

export type RecentReport = z.infer<typeof recentReportSchema>
export type RecentUser = z.infer<typeof recentUserSchema>
export type GrowthPoint = z.infer<typeof growthPointSchema>
export type DashboardData = z.infer<typeof dashboardSchema>
