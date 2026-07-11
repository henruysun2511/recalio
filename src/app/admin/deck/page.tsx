"use client";

import { DataTable } from "@/components/common/data-table";
import { useAdminPublicDecks, useToggleFeatured } from "@/queries/useDeckQuery";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./deck-columns";
import { DeckFilter } from "./deck-filter";
import { DeckResponse } from "@/schemas/deck.schema";

export default function AdminDeckPage() {
    const [query, setQuery] = useState<{ page?: number; limit?: number; search?: string }>({ page: 1, limit: 20 });
    const { data, isLoading } = useAdminPublicDecks(query);
    const featureMutation = useToggleFeatured();

    const handleToggleFeature = async (deck: DeckResponse) => {
        try {
            await featureMutation.mutateAsync(deck.id, {
                onSuccess: (response: any) => {
                    toast.success(response?.data?.message || (deck.isFeatured ? `Đã bỏ nổi bật "${deck.name}"` : `Đã đánh dấu nổi bật "${deck.name}"`));
                },
                onError: (error: any) => {
                    handleError(error, "Không thể thay đổi trạng thái nổi bật");
                },
            });
        } catch (error) { console.error("Toggle feature failed", error); }
    };

    const responseData = (data as any)?.data || [];
    const meta = (data as any)?.meta || {};
    const decks = Array.isArray(responseData) ? responseData : [];

    const columns = getColumns({ onToggleFeature: handleToggleFeature });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Deck
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Quản lý deck nổi bật
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <DeckFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined, page: 1 }))}
                    placeholder="Tìm kiếm deck công khai..."
                />
                <div className="p-0">
                    <DataTable columns={columns} data={decks} loading={isLoading} />
                </div>
            </div>
        </div>
    );
}
