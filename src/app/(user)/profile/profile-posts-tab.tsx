"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { SortOrder } from "@/constants/sort"
import { usePosts, useDeletePost, useTogglePostLike, useReportPost } from "@/queries/usePostQuery"
import { useAuthStore } from "@/stores/useAuthStore"
import { PostCard } from "@/components/common/post-card"
import { PostCardSkeleton } from "@/components/common/skeleton/post-card-skeleton"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { DataPagination } from "@/components/common/data-pagination"
import { handleError } from "@/utils/handleError"
import { PostDialog } from "../community/post-create-dialog"
import { PostCommentDialog } from "../community/post-comment-dialog"
import { PostReportDialog } from "../community/post-report-dialog"
import type { Post } from "@/schemas/post.schema"

const PAGE_SIZE = 10

export function ProfilePostsTab({ userId, currentUserId }: { userId: string; currentUserId?: string }) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const { data: res, isLoading } = usePosts({ userId, page, limit: PAGE_SIZE, sortOrder: SortOrder.DESC })
    const deleteMutation = useDeletePost()
    const toggleLikeMutation = useTogglePostLike()
    const reportMutation = useReportPost()
    const loginnedUser = useAuthStore((s) => s.user)

    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deletePostId, setDeletePostId] = useState<string | null>(null)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportPostId, setReportPostId] = useState<string | null>(null)
    const [commentPostId, setCommentPostId] = useState<string | null>(null)

    const items = (res?.data ?? []) as Post[]
    const meta = (res as any)?.meta
    const totalPages = meta ? Math.ceil((meta.total ?? 0) / (meta.limit ?? PAGE_SIZE)) : 0

    const filtered = search
        ? items.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        )
        : items

    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setDialogOpen(true)
    }

    const handleCloseDialog = (open: boolean) => {
        setDialogOpen(open)
        if (!open) setEditingPost(null)
    }

    const handleToggleLike = async (id: string) => {
        try {
            await toggleLikeMutation.mutateAsync(id, {
                onSuccess: (res: any) => {
                    const liked = res?.data?.data?.liked
                    toast.success(res?.data?.message || (liked ? "Đã thích bài viết" : "Đã bỏ thích bài viết"))
                },
                onError: (err: any) => handleError(err, "Thao tác thất bại"),
            })
        } catch (error) {
            console.error("Toggle like failed", error)
        }
    }

    const handleDeleteTrigger = (id: string) => {
        setDeletePostId(id)
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!deletePostId) return
        try {
            await deleteMutation.mutateAsync(deletePostId, {
                onSuccess: (res: any) => {
                    toast.success(res?.message || "Xóa bài viết thành công")
                    setDeleteConfirmOpen(false)
                    setDeletePostId(null)
                },
                onError: (err: any) => handleError(err, "Xóa bài viết thất bại"),
            })
        } catch (error) {
            console.error("Delete post failed", error)
        }
    }

    const handleReportTrigger = (id: string) => {
        setReportPostId(id)
        setReportDialogOpen(true)
    }

    const handleReportConfirm = async (reason: string, description?: string) => {
        if (!reportPostId) return
        try {
            await reportMutation.mutateAsync({ id: reportPostId, data: { reason: reason as any, description } }, {
                onSuccess: (res: any) => {
                    toast.success(res?.data?.message || "Báo cáo bài viết thành công")
                    setReportDialogOpen(false)
                    setReportPostId(null)
                },
                onError: (err: any) => handleError(err, "Báo cáo thất bại"),
            })
        } catch (error) {
            console.error("Report post failed", error)
        }
    }

    const handleComment = (id: string) => {
        setCommentPostId(id)
    }

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm bài đăng..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                />
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="Chưa có bài đăng" description={search ? "Thử tìm kiếm với từ khóa khác." : "Người dùng chưa có bài đăng nào."} />
            ) : (
                <div className="space-y-4">
                    {filtered.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onEdit={currentUserId ? handleEdit : undefined}
                            onDelete={currentUserId ? handleDeleteTrigger : undefined}
                            onToggleLike={handleToggleLike}
                            onComment={handleComment}
                            onReport={handleReportTrigger}
                            currentUserId={loginnedUser?.id}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <DataPagination page={meta?.page ?? 1} totalPages={totalPages} onPageChange={setPage} />
            )}

            <PostDialog open={dialogOpen} onOpenChange={handleCloseDialog} initialData={editingPost ?? undefined} />
            <PostCommentDialog postId={commentPostId ?? ""} open={!!commentPostId} onOpenChange={(open) => { if (!open) setCommentPostId(null) }} />
            <PostReportDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} onConfirm={handleReportConfirm} loading={reportMutation.isPending} />
            <ConfirmDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen} onConfirm={handleConfirmDelete} loading={deleteMutation.isPending} />
        </div>
    )
}
