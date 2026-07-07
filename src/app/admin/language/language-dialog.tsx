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
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Language, createLanguageSchema, updateLanguageSchema } from "@/schemas/language.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobeIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface LanguageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof createLanguageSchema | typeof updateLanguageSchema>) => void;
    initialData?: Language | null;
    loading?: boolean;
}

export function LanguageDialog({ open, onOpenChange, onSubmit, initialData, loading }: LanguageDialogProps) {
    const schema = initialData ? updateLanguageSchema : createLanguageSchema;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { isSupported: false },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    nativeName: initialData.nativeName,
                    flagEmoji: initialData.flagEmoji,
                    isSupported: initialData.isSupported,
                });
            } else {
                form.reset({ id: "", name: "", nativeName: "", flagEmoji: "", isSupported: false });
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
                        <GlobeIcon className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {initialData ? "Chỉnh sửa ngôn ngữ" : "Thêm ngôn ngữ mới"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {initialData ? "Cập nhật thông tin ngôn ngữ..." : "Thêm ngôn ngữ mới vào hệ thống..."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body">
                            {!initialData && (
                                <FormField
                                    control={form.control}
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 md:col-span-1">
                                            <FormLabel className="admin-form-label">Mã ngôn ngữ</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="vd: vi, en, ja..."
                                                    className="admin-form-input"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className={initialData ? "col-span-2" : "col-span-2 md:col-span-1"}>
                                        <FormLabel className="admin-form-label">Tên ngôn ngữ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: Tiếng Việt, English, 日本語..."
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
                                name="nativeName"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Tên bản ngữ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: Tiếng Việt, English, 日本語..."
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
                                name="flagEmoji"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Flag Emoji</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: 🇻🇳, 🇺🇸, 🇯🇵..."
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
                                name="isSupported"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 admin-field-card">
                                        <div>
                                            <FormLabel className="text-sm font-bold text-text-primary">Hỗ trợ ngôn ngữ</FormLabel>
                                            <p className="text-xs text-text-muted">Cho phép người dùng sử dụng ngôn ngữ này</p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </FormControl>
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
