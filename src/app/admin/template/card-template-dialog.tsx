"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CardTemplate, createCardTemplateSchema, updateCardTemplateSchema } from "@/schemas/note-template.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Layers } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface CardTemplateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: z.infer<typeof createCardTemplateSchema | typeof updateCardTemplateSchema>) => void
    initialData?: CardTemplate | null
    loading?: boolean
}

export function CardTemplateDialog({ open, onOpenChange, onSubmit, initialData, loading }: CardTemplateDialogProps) {
    const schema = initialData ? updateCardTemplateSchema : createCardTemplateSchema

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", frontHtml: "", backHtml: "", css: "" },
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    frontHtml: initialData.frontHtml,
                    backHtml: initialData.backHtml,
                    css: initialData.css ?? "",
                })
            } else {
                form.reset({ name: "", frontHtml: "", backHtml: "", css: "" })
            }
        }
    }, [initialData, form, open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-peach">
                        <Layers className="size-5 text-terracotta" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {initialData ? "Chỉnh sửa card template" : "Thêm card template mới"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {initialData ? "Cập nhật nội dung card template..." : "Tạo card template mới cho note template..."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Tên card</FormLabel>
                                        <FormControl>
                                            <Input placeholder="vd: Vocabulary Card" className="admin-form-input" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="frontHtml"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="admin-form-label">Front HTML</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="{{Word}}"
                                                    className="admin-form-input min-h-[120px] font-mono text-xs"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="backHtml"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="admin-form-label">Back HTML</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="{{Meaning}}"
                                                    className="admin-form-input min-h-[120px] font-mono text-xs"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="css"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">CSS (tuỳ chọn)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=".card { font-size: 20px; }"
                                                className="admin-form-input min-h-[80px] font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="admin-dialog-footer">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="admin-btn-cancel">
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={loading} className="admin-btn-primary">
                                {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
