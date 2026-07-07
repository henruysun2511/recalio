import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import followService from "@/services/follow.service";
import { FollowParams } from "@/schemas/follow.schema";

export const FOLLOW_QUERY_KEY = ["follow"];

export const useFollowStatus = (userId: string) => {
    return useQuery({
        queryKey: [...FOLLOW_QUERY_KEY, "status", userId],
        queryFn: async () => {
            const res = await followService.checkStatus(userId);
            return res.data;
        },
        enabled: !!userId,
    });
};

export const useUserFollowing = (userId: string, params?: FollowParams) => {
    return useQuery({
        queryKey: [...FOLLOW_QUERY_KEY, userId, "following", params],
        queryFn: async () => {
            const res = await followService.listFollowing(userId, params);
            return res.data;
        },
        enabled: !!userId,
    });
};

export const useUserFollowers = (userId: string, params?: FollowParams) => {
    return useQuery({
        queryKey: [...FOLLOW_QUERY_KEY, userId, "followers", params],
        queryFn: async () => {
            const res = await followService.listFollowers(userId, params);
            return res.data;
        },
        enabled: !!userId,
    });
};

export const useMyFollowing = (params?: FollowParams) => {
    return useQuery({
        queryKey: [...FOLLOW_QUERY_KEY, "my-following", params],
        queryFn: async () => {
            const res = await followService.myFollowing(params);
            return res.data;
        },
    });
};

export const useMyFollowers = (params?: FollowParams) => {
    return useQuery({
        queryKey: [...FOLLOW_QUERY_KEY, "my-followers", params],
        queryFn: async () => {
            const res = await followService.myFollowers(params);
            return res.data;
        },
    });
};

export const useFollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followService.follow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEY });
        },
    });
};

export const useUnfollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followService.unfollow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FOLLOW_QUERY_KEY });
        },
    });
};
