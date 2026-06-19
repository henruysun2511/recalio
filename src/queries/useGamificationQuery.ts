import { useQuery } from "@tanstack/react-query";
import gamificationService from "@/services/gamification.service";
import { LeaderboardParams } from "@/schemas/gamification.schema";

export const useXp = () => {
    return useQuery({
        queryKey: ["gamification", "xp"],
        queryFn: () => gamificationService.getXp(),
    });
};

export const useAchievements = () => {
    return useQuery({
        queryKey: ["gamification", "achievements"],
        queryFn: () => gamificationService.getAchievements(),
    });
};

export const useLeaderboard = (params?: LeaderboardParams) => {
    return useQuery({
        queryKey: ["gamification", "leaderboard", params],
        queryFn: () => gamificationService.getLeaderboard(params),
    });
};
