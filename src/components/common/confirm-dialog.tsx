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
import { AlertTriangleIcon } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Xác nhận xóa",
    description = "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa mục này?",
    buttonText = "Xác nhận xóa",
    loading,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent data-role="admin" className="sm:max-w-[450px] admin-dialog-content overflow-hidden">
                <DialogHeader className="p-8">
                    <div className="admin-dialog-icon-box bg-red-50">
                        <AlertTriangleIcon className="size-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-xl font-black tracking-tighter text-text-primary">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="admin-dialog-footer bg-cream/50">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="admin-btn-cancel"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="admin-btn-danger"
                    >
                        {loading ? "Đang thực hiện" : buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
