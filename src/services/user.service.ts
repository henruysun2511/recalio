import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { UpdateProfileInput, UserProfile, UserQuery, UserListResponse, UpdateRoleInput } from "@/schemas/user.schema";

const prefix = "/users";

const userService = {
    getMe: () => {
        return http.get<ApiResponse<UserProfile>>(`${prefix}/me`);
    },

    updateMe: (data: UpdateProfileInput) => {
        return http.patch<ApiResponse<UserProfile>>(`${prefix}/me`, data);
    },

    list: (params?: UserQuery) => {
        return http.get<ApiResponse<UserListResponse>>(prefix, { params });
    },

    toggleActive: (id: string) => {
        return http.patch<ApiResponse<UserProfile>>(`${prefix}/${id}/toggle-active`);
    },

    updateRole: (id: string, data: UpdateRoleInput) => {
        return http.patch<ApiResponse<UserProfile>>(`${prefix}/${id}/role`, data);
    },
};

export default userService;
