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

const prefix = "/notifications";
const settingsPrefix = "/notification-settings";

const notificationService = {
    getSettings: () => {
        return http.get<ApiResponse<NotificationSetting>>(settingsPrefix);
    },

    updateSettings: (data: UpdateNotificationSettingInput) => {
        return http.patch<ApiResponse<NotificationSetting>>(settingsPrefix, data);
    },

    list: (params?: NotificationParams) => {
        return http.get<ApiResponse<Notification[]> & { meta?: Pagination }>(prefix, { params });
    },

    getUnreadCount: () => {
        return http.get<ApiResponse<{ count: number }>>(`${prefix}/unread-count`);
    },

    markAllRead: () => {
        return http.patch<ApiResponse<null>>(`${prefix}/read-all`);
    },

    markRead: (id: string) => {
        return http.patch<ApiResponse<null>>(`${prefix}/${id}/read`);
    },

    create: (data: CreateNotificationInput) => {
        return http.post<ApiResponse<Notification>>(prefix, data);
    },
};

export default notificationService;
