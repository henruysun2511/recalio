import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import notificationService from "@/services/notification.service";
import { CreateNotificationInput, NotificationParams, UpdateNotificationSettingInput } from "@/schemas/notification.schema";
import { handleError } from "@/utils/handleError";

export const useNotificationSettings = () => {
    return useQuery({
        queryKey: ["notification-settings"],
        queryFn: () => notificationService.getSettings(),
    });
};

export const useUpdateNotificationSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateNotificationSettingInput) => notificationService.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
            toast.success("Notification settings updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update settings");
        },
    });
};

export const useNotifications = (params?: NotificationParams) => {
    return useQuery({
        queryKey: ["notifications", params],
        queryFn: () => notificationService.list(params),
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: () => notificationService.getUnreadCount(),
        refetchInterval: 30000,
    });
};

export const useMarkAllRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationService.markAllRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            handleError(error, "Failed to mark all as read");
        },
    });
};

export const useMarkRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationService.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            handleError(error, "Failed to mark as read");
        },
    });
};

export const useCreateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNotificationInput) => notificationService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Notification sent!");
        },
        onError: (error) => {
            handleError(error, "Failed to send notification");
        },
    });
};
