import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import { CreateNotificationInput, NotificationParams, UpdateNotificationSettingInput } from "@/schemas/notification.schema";

export const NOTIFICATION_QUERY_KEY = ["notification-settings"];
export const NOTIFICATION_LIST_QUERY_KEY = ["notifications"];

export const useNotificationSettings = () => {
    return useQuery({
        queryKey: NOTIFICATION_QUERY_KEY,
        queryFn: async () => {
            const res = await notificationService.getSettings();
            return res.data;
        },
    });
};

export const useUpdateNotificationSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateNotificationSettingInput) => notificationService.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
        },
    });
};

export const useNotifications = (params?: NotificationParams) => {
    return useQuery({
        queryKey: [...NOTIFICATION_LIST_QUERY_KEY, params],
        queryFn: async () => {
            const res = await notificationService.list(params);
            return res.data;
        },
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: [...NOTIFICATION_LIST_QUERY_KEY, "unread-count"],
        queryFn: async () => {
            const res = await notificationService.getUnreadCount();
            return res.data;
        },
        refetchInterval: 30000,
    });
};

export const useMarkAllRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationService.markAllRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_LIST_QUERY_KEY });
        },
    });
};

export const useMarkRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationService.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_LIST_QUERY_KEY });
        },
    });
};

export const useCreateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNotificationInput) => notificationService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_LIST_QUERY_KEY });
        },
    });
};
