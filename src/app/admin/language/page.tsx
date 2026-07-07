"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
    useCreateLanguage,
    useDeleteLanguage,
    useLanguages,
    useUpdateLanguage,
} from "@/queries/useLanguageQuery";
import { Language, LanguageQuery } from "@/schemas/language.schema";
import { handleError } from "@/utils/handleError";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./language-columns";
import { LanguageDialog } from "./language-dialog";
import { LanguageFilter } from "./language-filter";

export default function AdminLanguagePage() {
    const [query, setQuery] = useState<LanguageQuery>({});
    const { data, isLoading } = useLanguages(query);
    const createMutation = useCreateLanguage();
    const updateMutation = useUpdateLanguage();
    const deleteMutation = useDeleteLanguage();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLang, setEditingLang] = useState<Language | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleAdd = () => { setEditingLang(null); setDialogOpen(true); };
    const handleEdit = (lang: Language) => { setEditingLang(lang); setDialogOpen(true); };
    const handleDeleteTrigger = (id: string) => { setDeleteId(id); setConfirmOpen(true); };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Xóa ngôn ngữ thành công");
                    setConfirmOpen(false);
                    setDeleteId(null);
                },
                onError: (error: any) => {
                    handleError(error, "Không thể xóa ngôn ngữ");
                },
            });
        } catch (error) { console.error("Delete failed", error); }
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editingLang) {
                await updateMutation.mutateAsync({ id: editingLang.id, data: formData }, {
                    onSuccess: (response: any) => {
                        toast.success(response?.message || "Cập nhật ngôn ngữ thành công");
                        setDialogOpen(false);
                    },
                    onError: (error: any) => {
                        handleError(error, "Cập nhật ngôn ngữ thất bại");
                    },
                });
            } else {
                await createMutation.mutateAsync(formData, {
                    onSuccess: (response: any) => {
                        toast.success(response?.message || "Thêm ngôn ngữ thành công");
                        setDialogOpen(false);
                    },
                    onError: (error: any) => {
                        handleError(error, "Thêm ngôn ngữ thất bại");
                    },
                });
            }
        } catch (error) { console.error("Submit failed", error); }
    };

    const languages = ((data as any)?.data || []) as Language[];
    const columns = getColumns({ onEdit: handleEdit, onDelete: handleDeleteTrigger });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                        Ngôn ngữ
                    </p>
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                        Quản lý ngôn ngữ
                    </h1>
                </div>
                <Button onClick={handleAdd} className="bg-primary text-white px-6 h-11 rounded-md font-semibold">
                    <PlusIcon className="mr-2 size-4" /> Thêm ngôn ngữ
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <LanguageFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined }))}
                    onFilterChange={(filters) => setQuery((prev) => ({ ...prev, ...filters }))}
                />
                <div className="p-0">
                    <DataTable columns={columns} data={languages} loading={isLoading} />
                </div>
            </div>

            <LanguageDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                initialData={editingLang}
                loading={createMutation.isPending || updateMutation.isPending}
            />
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleConfirmDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    );
}
