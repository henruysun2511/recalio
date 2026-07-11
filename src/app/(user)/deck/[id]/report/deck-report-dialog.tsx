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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ReportReason } from "@/constants/type"
import { createReportSchema } from "@/schemas/report.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Flag } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = createReportSchema

interface DeckReportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: z.infer<typeof formSchema>) => void
    loading?: boolean
}

export function DeckReportDialog({ open, onOpenChange, onSubmit, loading }: DeckReportDialogProps) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { reason: undefined, description: "" },
    })

    useEffect(() => {
        if (open) {
            form.reset({ reason: undefined, description: "" })
        }
    }, [open, form])

    const handleSubmit = form.handleSubmit((data) => {
        onSubmit(data)
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-none sm:max-w-[500px] max-h-[90vh] overflow-y-auto admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-red-100">
                        <Flag className="size-5 text-red-500" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        Báo cáo vi phạm
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        Chọn lý do và cung cấp thêm thông tin nếu cần
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-8 space-y-5">
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Lý do báo cáo</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="admin-form-select h-12 rounded-xl border-beige bg-white">
                                                    <SelectValue placeholder="Chọn lý do..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent data-role="admin">
                                                {Object.values(ReportReason).map((reason) => (
                                                    <SelectItem key={reason} value={reason}>
                                                        {reason === "COPYRIGHT" ? "Vi phạm bản quyền"
                                                            : reason === "SPAM" ? "Spam"
                                                            : reason === "INAPPROPRIATE" ? "Nội dung không phù hợp"
                                                            : "Khác"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Mô tả thêm (không bắt buộc)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Cung cấp thêm thông tin chi tiết..."
                                                className="min-h-[100px] rounded-xl border-beige bg-white"
                                                {...field}
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
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="admin-btn-cancel"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="admin-btn-primary bg-red-500 hover:bg-red-600"
                            >
                                {loading ? "Đang gửi..." : "Gửi báo cáo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
