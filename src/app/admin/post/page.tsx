"use client";

import { DataTable } from "@/components/common/data-table";
import { useAdminPosts, useBanPost } from "@/queries/usePostQuery";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./post-columns";
import { PostFilter } from "./post-filter";
import { PostQuery } from "@/schemas/post.schema";

export default function AdminPostPage() {
    const [query, setQuery] = useState<PostQuery>({ page: 1, limit: 20 });
    const { data, isLoading } = useAdminPosts(query);
    const banMutation = useBanPost();

    const handleToggleBan = async (id: string, currentBanned: boolean, title: string) => {
        try {
            await banMutation.mutateAsync({ id, isBanned: !currentBanned }, {
                onSuccess: (response: any) => {
                    toast.success(response?.data?.message || (currentBanned ? `Đã bỏ cấm "${title}"` : `Đã cấm "${title}"`));
                },
                onError: (error: any) => {
                    handleError(error, "Không thể thay đổi trạng thái");
                },
            });
        } catch (error) { console.error("Toggle ban failed", error); }
    };

    const responseData = (data as any)?.data || [];
    const posts = Array.isArray(responseData) ? responseData : [];

    const columns = getColumns({ onToggleBan: handleToggleBan });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Bài viết
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Quản lý bài viết bị tố cáo
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <PostFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined, page: 1 }))}
                />
                <div className="p-0">
                    <DataTable columns={columns} data={posts} loading={isLoading} />
                </div>
            </div>
        </div>
    );
}
