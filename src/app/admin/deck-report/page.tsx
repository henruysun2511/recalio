"use client";

import { DataTable } from "@/components/common/data-table";
import { useReports } from "@/queries/useReportQuery";
import { useToggleBan } from "@/queries/useDeckQuery";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./deck-columns";
import { DeckFilter } from "./deck-filter";

export default function AdminDeckPage() {
    const [query, setQuery] = useState<{ page: number; limit: number; status?: string; reason?: string; search?: string }>({ page: 1, limit: 20 });
    const { data, isLoading } = useReports(query);
    const toggleBanMutation = useToggleBan();

    const handleToggleBan = async (deckId: string, currentBanned: boolean, deckName: string) => {
        try {
            await toggleBanMutation.mutateAsync(deckId, {
                onSuccess: (response: any) => {
                    toast.success(response?.data?.message || (currentBanned ? `Đã bỏ cấm "${deckName}"` : `Đã cấm "${deckName}"`));
                },
                onError: (error: any) => {
                    handleError(error, "Không thể thay đổi trạng thái");
                },
            });
        } catch (error) { console.error("Toggle ban failed", error); }
    };

    const responseData = (data as any)?.data || [];
    const meta = (data as any)?.meta || {};
    const reports = Array.isArray(responseData) ? responseData : [];

    const columns = getColumns({ onToggleBan: handleToggleBan });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Deck
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Deck vi phạm
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <DeckFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined, page: 1 }))}
                />
                <div className="p-0">
                    <DataTable columns={columns} data={reports} loading={isLoading} />
                </div>
            </div>
        </div>
    );
}
