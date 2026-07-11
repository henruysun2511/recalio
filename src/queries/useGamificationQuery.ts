import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import gamificationService from "@/services/gamification.service";
import { LeaderboardParams, StudyCalendarParams, UpdateDailyGoalInput } from "@/schemas/gamification.schema";

export const GAMIFICATION_QUERY_KEY = ["gamification"];

export const useXp = (userId?: string) => {
    const params = userId ? { userId } : undefined;
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "xp", params],
        queryFn: async () => {
            const res = await gamificationService.getXp(params);
            return res.data;
        },
    });
};

export const useAchievements = (userId?: string) => {
    const params = userId ? { userId } : undefined;
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "achievements", params],
        queryFn: async () => {
            const res = await gamificationService.getAchievements(params);
            return res.data;
        },
    });
};

export const useLeaderboard = (params?: LeaderboardParams) => {
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "leaderboard", params],
        queryFn: async () => {
            const res = await gamificationService.getLeaderboard(params);
            return res.data;
        },
    });
};

export const useStudyCalendar = (userId?: string, params?: StudyCalendarParams) => {
    const queryParams = userId ? { ...params, userId } : params;
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "calendar", queryParams],
        queryFn: async () => {
            const res = await gamificationService.getStudyCalendar(queryParams);
            return res.data;
        },
    });
};

export const useReviewStats = (userId?: string) => {
    const params = userId ? { userId } : undefined;
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "review-stats", params],
        queryFn: async () => {
            const res = await gamificationService.getReviewStats(params);
            return res.data;
        },
    });
};

export const useStudyStreak = (userId?: string) => {
    const params = userId ? { userId } : undefined;
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "streak", params],
        queryFn: async () => {
            const res = await gamificationService.getStudyStreak(params);
            return res.data;
        },
    });
};

export const useDailyGoal = () => {
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "daily-goal"],
        queryFn: async () => {
            const res = await gamificationService.getDailyGoal();
            return res.data;
        },
    });
};

export const useUpdateDailyGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDailyGoalInput) => gamificationService.updateDailyGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...GAMIFICATION_QUERY_KEY, "daily-goal"] });
        },
    });
};
