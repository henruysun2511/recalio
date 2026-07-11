"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNotificationSchema } from "@/schemas/notification.schema";
import { useCreateNotification } from "@/queries/useNotificationQuery";
import { NotificationType, NotificationChannel } from "@/constants/type";
import { handleError } from "@/utils/handleError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NOTIFICATION_TYPES = Object.entries(NotificationType).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const NOTIFICATION_CHANNELS = Object.entries(NotificationChannel).map(([key, value]) => ({
    value,
    label: key === "WEB_PUSH" ? "Web Push" : key === "MOBILE_PUSH" ? "Mobile Push" : key,
}));

type FormData = z.infer<typeof createNotificationSchema>;

export default function AdminNotificationPage() {
    const createMutation = useCreateNotification();

    const form = useForm<FormData>({
        resolver: zodResolver(createNotificationSchema),
        defaultValues: {
            title: "",
            body: "",
            username: "",
        },
    });

    const handleSubmit = async (data: FormData) => {
        try {
            await createMutation.mutateAsync({
                ...data,
                username: data.username || undefined,
                body: data.body || undefined,
            }, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Gửi thông báo thành công");
                    form.reset({ title: "", body: "", username: "" });
                },
                onError: (error: any) => {
                    handleError(error, "Không thể gửi thông báo");
                },
            });
        } catch (error) { console.error("Submit failed", error); }
    };

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Notification
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Gửi thông báo
                </h1>
            </div>

            <Card className="border border-beige shadow-sm">
                <CardHeader className="border-b border-beige bg-cream/50">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-text-primary">
                        <Bell className="size-5" />
                        Tạo thông báo mới
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-2xl">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Tiêu đề</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="VD: Bảo trì hệ thống"
                                                className="admin-form-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Nội dung</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="VD: Hệ thống sẽ bảo trì lúc 2h sáng ngày mai..."
                                                className="admin-form-input"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="admin-form-label">Loại thông báo</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="admin-form-input">
                                                        <SelectValue placeholder="Mặc định (SYSTEM)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {NOTIFICATION_TYPES.map((t) => (
                                                            <SelectItem key={t.value} value={t.value}>
                                                                {t.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="channel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="admin-form-label">Kênh gửi</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="admin-form-input">
                                                        <SelectValue placeholder="Mặc định (WEB_PUSH)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {NOTIFICATION_CHANNELS.map((c) => (
                                                            <SelectItem key={c.value} value={c.value}>
                                                                {c.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Người nhận (Username)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Để trống để gửi đến tất cả người dùng"
                                                className="admin-form-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-text-muted">Nhập username để gửi riêng, bỏ trống để broadcast toàn hệ thống</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="admin-btn-primary"
                                >
                                    <Send className="mr-2 size-4" />
                                    {createMutation.isPending ? "Đang gửi..." : "Gửi thông báo"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => form.reset({ title: "", body: "", username: "" })}
                                    className="admin-btn-cancel"
                                >
                                    Xoá form
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
