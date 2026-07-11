"use client";

import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAchievements, useCreateAchievement, useUpdateAchievement, useDeleteAchievement } from "@/queries/useAchievementQuery";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./achievement-columns";
import { AchievementFilter } from "./achievement-filter";
import { AchievementDialog } from "./achievement-dialog";
import { AchievementResponse } from "@/schemas/achievement.schema";

export default function AdminAchievementPage() {
    const [query, setQuery] = useState<{ page?: number; limit?: number; search?: string }>({ page: 1, limit: 20 });
    const { data, isLoading } = useAchievements(query);
    const createMutation = useCreateAchievement();
    const updateMutation = useUpdateAchievement();
    const deleteMutation = useDeleteAchievement();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<AchievementResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AchievementResponse | null>(null);

    const achievements = data?.data || [];
    const meta = data?.meta;

    const handleAdd = () => { setEditingAchievement(null); setDialogOpen(true); };
    const handleEdit = (achievement: AchievementResponse) => { setEditingAchievement(achievement); setDialogOpen(true); };

    const handleSubmit = async (formData: any) => {
        try {
            if (editingAchievement) {
                await updateMutation.mutateAsync({ id: editingAchievement.id, data: formData }, {
                    onSuccess: (response: any) => {
                        toast.success(response?.message || "Cập nhật thành tích thành công");
                        setDialogOpen(false);
                    },
                    onError: (error: any) => {
                        handleError(error, "Không thể cập nhật thành tích");
                    },
                });
            } else {
                await createMutation.mutateAsync(formData, {
                    onSuccess: (response: any) => {
                        toast.success(response?.message || "Tạo thành tích thành công");
                        setDialogOpen(false);
                    },
                    onError: (error: any) => {
                        handleError(error, "Không thể tạo thành tích");
                    },
                });
            }
        } catch (error) { console.error("Submit failed", error); }
    };

    const handleDelete = (achievement: AchievementResponse) => {
        setDeleteTarget(achievement);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteMutation.mutateAsync(deleteTarget.id);
            toast.success("Xoá thành tích thành công");
            setDeleteTarget(null);
        } catch (error) {
            handleError(error, "Không thể xoá thành tích");
        }
    };

    const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

    const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                        Achievement
                    </p>
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                        Quản lý thành tích
                    </h1>
                </div>
                <Button onClick={handleAdd} disabled={isSubmitting}>
                    + Thêm thành tích
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <AchievementFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined, page: 1 }))}
                    placeholder="Tìm kiếm thành tích..."
                />
                <div className="p-0">
                    <DataTable columns={columns} data={achievements} loading={isLoading} />
                </div>
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-beige">
                        <DataPagination
                            page={meta.page}
                            totalPages={meta.totalPages}
                            onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
                        />
                    </div>
                )}
            </div>

            <AchievementDialog
                open={dialogOpen}
                onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditingAchievement(null) }}
                onSubmit={handleSubmit}
                initialData={editingAchievement}
                loading={isSubmitting}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
                onConfirm={handleConfirmDelete}
                title="Xoá thành tích"
                description={`Bạn có chắc chắn muốn xoá "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
                buttonText="Xoá thành tích"
                loading={deleteMutation.isPending}
            />
        </div>
    );
}