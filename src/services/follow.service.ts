import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { FollowParams, FollowStatus, FollowUser } from "@/schemas/follow.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/follow";

const followService = {
    follow: (userId: string) => {
        return http.post<ApiResponse<FollowUser>>(`${prefix}/${userId}`);
    },

    unfollow: (userId: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${userId}`);
    },

    checkStatus: (userId: string) => {
        return http.get<ApiResponse<FollowStatus>>(`${prefix}/${userId}/status`);
    },

    listFollowing: (userId: string, params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`${prefix}/${userId}/following`, { params });
    },

    listFollowers: (userId: string, params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`${prefix}/${userId}/followers`, { params });
    },

    myFollowing: (params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`${prefix}/following`, { params });
    },

    myFollowers: (params?: FollowParams) => {
        return http.get<ApiResponse<FollowUser[]> & { meta?: Pagination }>(`${prefix}/followers`, { params });
    },
};

export default followService;
