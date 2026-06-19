import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { FollowParams, FollowStatus, FollowUser } from "@/schemas/follow.schema";
import { Pagination } from "@/constants/pagination";

const followService = {
    follow: (userId: string) => {
        return http.post<ApiResponse<FollowUser>>(`/follow/${userId}`);
    },

    unfollow: (userId: string) => {
        return http.delete<ApiResponse<null>>(`/follow/${userId}`);
    },

    checkStatus: (userId: string) => {
        return http.get<ApiResponse<FollowStatus>>(`/follow/${userId}/status`);
    },

    listFollowing: (userId: string, params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`/follow/${userId}/following`, { params });
    },

    listFollowers: (userId: string, params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`/follow/${userId}/followers`, { params });
    },

    myFollowing: (params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>("/follow/following", { params });
    },

    myFollowers: (params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>("/follow/followers", { params });
    },
};

export default followService;
