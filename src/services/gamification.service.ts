import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AchievementsResponse, DailyGoal, LeaderboardParams, LeaderboardUser, ReviewStats, StudyCalendarEntry, StudyCalendarParams, StudyStreak, UpdateDailyGoalInput, XpResponse } from "@/schemas/gamification.schema";

const prefix = "/gamification";

const gamificationService = {
    getXp: (params?: { userId?: string }) => {
        return http.get<ApiResponse<XpResponse>>(`${prefix}/xp`, { params });
    },

    getAchievements: (params?: { userId?: string }) => {
        return http.get<ApiResponse<AchievementsResponse>>(`${prefix}/achievements`, { params });
    },

    getLeaderboard: (params?: LeaderboardParams) => {
        return http.get<ApiResponse<LeaderboardUser[]>>(`${prefix}/leaderboard`, { params });
    },

    getStudyCalendar: (params?: StudyCalendarParams) => {
        return http.get<ApiResponse<StudyCalendarEntry[]>>(`${prefix}/calendar`, { params });
    },

    getStudyStreak: (params?: { userId?: string }) => {
        return http.get<ApiResponse<StudyStreak>>(`${prefix}/streak`, { params });
    },

    getReviewStats: (params?: { userId?: string }) => {
        return http.get<ApiResponse<ReviewStats>>(`${prefix}/review-stats`, { params });
    },

    getDailyGoal: () => {
        return http.get<ApiResponse<DailyGoal>>(`${prefix}/daily-goal`);
    },

    updateDailyGoal: (data: UpdateDailyGoalInput) => {
        return http.patch<ApiResponse<DailyGoal>>(`${prefix}/daily-goal`, data);
    },
};

export default gamificationService;
