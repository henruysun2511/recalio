import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AchievementsResponse, LeaderboardParams, LeaderboardUser, XpResponse } from "@/schemas/gamification.schema";

const prefix = "/gamification";

const gamificationService = {
    getXp: () => {
        return http.get<ApiResponse<XpResponse>>(`${prefix}/xp`);
    },

    getAchievements: () => {
        return http.get<ApiResponse<AchievementsResponse>>(`${prefix}/achievements`);
    },

    getLeaderboard: (params?: LeaderboardParams) => {
        return http.get<ApiResponse<LeaderboardUser[]>>(`${prefix}/leaderboard`, { params });
    },
};

export default gamificationService;
