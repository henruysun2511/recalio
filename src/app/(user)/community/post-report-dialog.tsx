"use client"

import { useState } from "react"
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
import { ReportReason } from "@/constants/type"
import { AlertTriangleIcon } from "lucide-react"

interface PostReportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (reason: ReportReason, description?: string) => void
    loading?: boolean
}

const reasonLabels: Record<ReportReason, string> = {
    [ReportReason.COPYRIGHT]: "Vi phạm bản quyền",
    [ReportReason.SPAM]: "Spam",
    [ReportReason.INAPPROPRIATE]: "Nội dung không phù hợp",
    [ReportReason.OTHER]: "Khác",
}

export function PostReportDialog({ open, onOpenChange, onConfirm, loading }: PostReportDialogProps) {
    const [reason, setReason] = useState<ReportReason>(ReportReason.OTHER)
    const [description, setDescription] = useState("")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-red-50">
                        <AlertTriangleIcon className="size-6 text-red-500" />
                    </div>
                    <DialogTitle className="admin-dialog-title">Báo cáo bài viết</DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        Chọn lý do báo cáo bài viết này. Chúng tôi sẽ xem xét và có biện pháp xử lý.
                    </DialogDescription>
                </DialogHeader>

                <div className="admin-dialog-body">
                    <div className="col-span-2 space-y-2">
                        <label className="admin-form-label">Lý do báo cáo</label>
                        <Select value={reason} onValueChange={(val) => setReason(val as ReportReason)}>
                            <SelectTrigger className="admin-form-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ReportReason).map((r) => (
                                    <SelectItem key={r} value={r}>{reasonLabels[r]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label className="admin-form-label">Mô tả thêm</label>
                        <Textarea
                            placeholder="Cung cấp thêm thông tin về vi phạm..."
                            className="admin-form-input min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="admin-dialog-footer">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="admin-btn-cancel">
                        Hủy bỏ
                    </Button>
                    <Button type="button" onClick={() => onConfirm(reason, description || undefined)} disabled={loading} className="admin-btn-primary">
                        {loading ? "Đang gửi..." : "Gửi báo cáo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
