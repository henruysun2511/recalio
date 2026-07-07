import { NotificationChannel, NotificationType } from "@/constants/type";
import { NotificationSortBy, SortOrder } from "@/constants/sort";
import { z } from "zod";

export const notificationSettingSchema = z.object({
    emailEnabled: z.boolean(),
    pushEnabled: z.boolean(),
    studyReminder: z.boolean(),
    reminderTime: z.string().nullable().optional(),
});

export type NotificationSetting = z.infer<typeof notificationSettingSchema>;

export const updateNotificationSettingSchema = z.object({
    emailEnabled: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
    studyReminder: z.boolean().optional(),
    reminderTime: z.string().optional(),
});

export type UpdateNotificationSettingInput = z.infer<typeof updateNotificationSettingSchema>;

export const notificationSchema = z.object({
    id: z.string().uuid(),
    type: z.nativeEnum(NotificationType),
    title: z.string(),
    body: z.string().nullable().optional(),
    data: z.any().nullable().optional(),
    isRead: z.boolean(),
    channel: z.nativeEnum(NotificationChannel),
    sentAt: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const notificationParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    type: z.nativeEnum(NotificationType, { message: "Loại thông báo không hợp lệ" }).optional(),
    isRead: z.boolean().optional(),
    sortBy: z.enum([NotificationSortBy.SENT_AT, NotificationSortBy.TYPE]).optional().default(NotificationSortBy.SENT_AT),
    sortOrder: z.enum([SortOrder.DESC, SortOrder.ASC]).optional().default(SortOrder.DESC),
});

export type NotificationParams = z.infer<typeof notificationParamsSchema>;

export const createNotificationSchema = z.object({
    type: z.nativeEnum(NotificationType, { message: "Loại thông báo không hợp lệ" }).optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    body: z.string().optional(),
    data: z.any().optional(),
    channel: z.nativeEnum(NotificationChannel, { message: "Kênh thông báo không hợp lệ" }).optional(),
    userId: z.string().uuid().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
