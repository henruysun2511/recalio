import { useQuery } from "@tanstack/react-query";
import gamificationService from "@/services/gamification.service";
import { LeaderboardParams } from "@/schemas/gamification.schema";

export const GAMIFICATION_QUERY_KEY = ["gamification"];

export const useXp = () => {
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "xp"],
        queryFn: async () => {
            const res = await gamificationService.getXp();
            return res.data;
        },
    });
};

export const useAchievements = () => {
    return useQuery({
        queryKey: [...GAMIFICATION_QUERY_KEY, "achievements"],
        queryFn: async () => {
            const res = await gamificationService.getAchievements();
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
