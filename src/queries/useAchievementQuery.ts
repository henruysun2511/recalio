import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import achievementService from "@/services/achievement.service";
import { CreateAchievementInput, UpdateAchievementInput, AchievementParams } from "@/schemas/achievement.schema";

export const ACHIEVEMENT_QUERY_KEY = ["achievements"];

export const useAchievements = (params?: Partial<AchievementParams>) => {
    return useQuery({
        queryKey: [...ACHIEVEMENT_QUERY_KEY, "admin", "list", params],
        queryFn: async () => {
            const res = await achievementService.list(params);
            return {
                data: res.data.data || [],
                meta: res.data.meta,
            };
        },
    });
};

export const useAchievement = (id: string) => {
    return useQuery({
        queryKey: [...ACHIEVEMENT_QUERY_KEY, "admin", id],
        queryFn: async () => {
            const res = await achievementService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateAchievement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAchievementInput) => achievementService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...ACHIEVEMENT_QUERY_KEY, "admin"] });
        },
    });
};

export const useUpdateAchievement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAchievementInput }) => achievementService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...ACHIEVEMENT_QUERY_KEY, "admin"] });
        },
    });
};

export const useDeleteAchievement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => achievementService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...ACHIEVEMENT_QUERY_KEY, "admin"] });
        },
    });
};