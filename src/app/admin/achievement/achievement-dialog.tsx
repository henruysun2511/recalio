"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { createAchievementSchema, updateAchievementSchema, AchievementResponse } from "@/schemas/achievement.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CONDITION_TYPES: { value: string; label: string }[] = [
    { value: "streak", label: "Số ngày liên tiếp (streak)" },
    { value: "reviews", label: "Số lượt ôn tập" },
    { value: "cards", label: "Số thẻ đã tạo" },
    { value: "xp", label: "Tổng XP tích lũy" },
];

interface AchievementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof createAchievementSchema | typeof updateAchievementSchema>) => Promise<void>;
    initialData?: AchievementResponse | null;
    loading?: boolean;
}

export function AchievementDialog({ open, onOpenChange, onSubmit, initialData, loading }: AchievementDialogProps) {
    const schema = initialData ? updateAchievementSchema : createAchievementSchema;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            key: "",
            name: "",
            description: "",
            iconUrl: null,
            xpReward: 0,
            condition: { type: "streak" as const, value: 1 },
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    description: initialData.description,
                    iconUrl: initialData.iconUrl,
                    xpReward: initialData.xpReward,
                    condition: initialData.condition,
                });
            } else {
                form.reset({ key: "", name: "", description: "", iconUrl: null, xpReward: 0, condition: { type: "streak", value: 1 } });
            }
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-primary/5">
                        <Trophy className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {initialData ? "Chỉnh sửa thành tích" : "Thêm thành tích mới"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {initialData ? "Cập nhật thông tin thành tích..." : "Thêm thành tích mới vào hệ thống..."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body">
                            {!initialData && (
                                <FormField
                                    control={form.control}
                                    name="key"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="admin-form-label">Key</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="VD: STREAK_7"
                                                    className="admin-form-input"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <p className="text-xs text-text-muted">Không thể thay đổi sau khi tạo</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Tên</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="VD: 7 Ngày liên tiếp"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="VD: Học liên tiếp 7 ngày"
                                                className="admin-form-input"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="iconUrl"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Icon URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com/icon.png"
                                                className="admin-form-input"
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value || null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="xpReward"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">XP thưởng</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                className="admin-form-input"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="condition.type"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Loại điều kiện</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="admin-form-input">
                                                    <SelectValue placeholder="Chọn loại điều kiện" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CONDITION_TYPES.map((t) => (
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
                                name="condition.value"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Giá trị điều kiện</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                className="admin-form-input"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="admin-dialog-footer">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="admin-btn-cancel"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="admin-btn-primary"
                            >
                                {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
