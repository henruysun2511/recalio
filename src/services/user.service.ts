import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { UpdateProfileInput, UserProfile } from "@/schemas/user.schema";

const userService = {
    getMe: () => {
        return http.get<ApiResponse<UserProfile>>("/users/me");
    },

    updateMe: (data: UpdateProfileInput) => {
        return http.patch<ApiResponse<UserProfile>>("/users/me", data);
    },
};

export default userService;
