import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import {
    CreateNotificationInput,
    Notification,
    NotificationParams,
    NotificationSetting,
    UpdateNotificationSettingInput,
} from "@/schemas/notification.schema";
import { Pagination } from "@/constants/pagination";

const notificationService = {
    getSettings: () => {
        return http.get<ApiResponse<NotificationSetting>>("/notification-settings");
    },

    updateSettings: (data: UpdateNotificationSettingInput) => {
        return http.patch<ApiResponse<NotificationSetting>>("/notification-settings", data);
    },

    list: (params?: NotificationParams) => {
        return http.get<ApiResponse<Notification[]> & { meta?: Pagination }>("/notifications", { params });
    },

    getUnreadCount: () => {
        return http.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
    },

    markAllRead: () => {
        return http.patch<ApiResponse<null>>("/notifications/read-all");
    },

    markRead: (id: string) => {
        return http.patch<ApiResponse<null>>(`/notifications/${id}/read`);
    },

    create: (data: CreateNotificationInput) => {
        return http.post<ApiResponse<Notification>>("/notifications", data);
    },
};

export default notificationService;
