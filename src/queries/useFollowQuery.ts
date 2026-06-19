import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import followService from "@/services/follow.service";
import { FollowParams } from "@/schemas/follow.schema";
import { handleError } from "@/utils/handleError";

export const useFollowStatus = (userId: string) => {
    return useQuery({
        queryKey: ["follow", "status", userId],
        queryFn: () => followService.checkStatus(userId),
        enabled: !!userId,
    });
};

export const useUserFollowing = (userId: string, params?: FollowParams) => {
    return useQuery({
        queryKey: ["follow", userId, "following", params],
        queryFn: () => followService.listFollowing(userId, params),
        enabled: !!userId,
    });
};

export const useUserFollowers = (userId: string, params?: FollowParams) => {
    return useQuery({
        queryKey: ["follow", userId, "followers", params],
        queryFn: () => followService.listFollowers(userId, params),
        enabled: !!userId,
    });
};

export const useMyFollowing = (params?: FollowParams) => {
    return useQuery({
        queryKey: ["follow", "my-following", params],
        queryFn: () => followService.myFollowing(params),
    });
};

export const useMyFollowers = (params?: FollowParams) => {
    return useQuery({
        queryKey: ["follow", "my-followers", params],
        queryFn: () => followService.myFollowers(params),
    });
};

export const useFollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followService.follow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["follow"] });
            toast.success("Followed!");
        },
        onError: (error) => {
            handleError(error, "Failed to follow user");
        },
    });
};

export const useUnfollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followService.unfollow(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["follow"] });
            toast.success("Unfollowed!");
        },
        onError: (error) => {
            handleError(error, "Failed to unfollow user");
        },
    });
};
