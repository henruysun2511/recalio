"use client";

import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { useSuggestions, useMarkSuggestionRead } from "@/queries/useSuggestionQuery";
import { SuggestionParams } from "@/schemas/suggestion.schema";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./suggestion-columns";

export default function AdminSuggestionPage() {
    const [query, setQuery] = useState<SuggestionParams>({ page: 1, limit: 20 });
    const { data, isLoading } = useSuggestions(query);
    const markReadMutation = useMarkSuggestionRead();

    const handleMarkRead = async (id: string) => {
        try {
            await markReadMutation.mutateAsync(id, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Đã đánh dấu đã đọc");
                },
                onError: (error: any) => {
                    handleError(error, "Không thể đánh dấu");
                },
            });
        } catch (error) { console.error("Mark read failed", error); }
    };

    const responseData = (data as any)?.data || [];
    const meta = (data as any)?.meta || {};
    const suggestions = Array.isArray(responseData) ? responseData : [];

    const columns = getColumns({ onMarkRead: handleMarkRead });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Suggestion
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Góp ý từ người dùng
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <div className="p-0">
                    <DataTable columns={columns} data={suggestions} loading={isLoading} />
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
        </div>
    );
}
