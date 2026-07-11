import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AchievementResponse, AchievementParams } from "@/schemas/achievement.schema";

const prefix = "/achievements";

const achievementService = {
    list: (params?: Partial<AchievementParams>) => {
        return http.get<ApiResponse<AchievementResponse[]> & { meta?: { page: number; limit: number; total: number; totalPages: number } }>(prefix, { params });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<AchievementResponse>>(`${prefix}/${id}`);
    },

    create: (data: { key: string; name: string; description: string; iconUrl?: string | null; xpReward: number; condition: { type: string; value: number } }) => {
        return http.post<ApiResponse<AchievementResponse>>(prefix, data);
    },

    update: (id: string, data: { name?: string; description?: string; iconUrl?: string | null; xpReward?: number; condition?: { type: string; value: number } }) => {
        return http.patch<ApiResponse<AchievementResponse>>(`${prefix}/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },
};

export default achievementService;