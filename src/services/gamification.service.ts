import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AchievementsResponse, LeaderboardParams, LeaderboardUser, XpResponse } from "@/schemas/gamification.schema";

const gamificationService = {
    getXp: () => {
        return http.get<ApiResponse<XpResponse>>("/gamification/xp");
    },

    getAchievements: () => {
        return http.get<ApiResponse<AchievementsResponse>>("/gamification/achievements");
    },

    getLeaderboard: (params?: LeaderboardParams) => {
        return http.get<ApiResponse<LeaderboardUser[]>>("/gamification/leaderboard", { params });
    },
};

export default gamificationService;
