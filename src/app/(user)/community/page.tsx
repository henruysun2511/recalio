"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { PostCard } from "../../../components/common/post-card"
import { PostFilter } from "./post-filter"
import { usePosts, useDeletePost, useTogglePostLike, useReportPost } from "@/queries/usePostQuery"
import { useAuthStore } from "@/stores/useAuthStore"
import { UserAvatar } from "@/components/common/user-avatar"
import { PostDialog } from "./post-create-dialog"
import { PostReportDialog } from "./post-report-dialog"
import { PostCommentDialog } from "./post-comment-dialog"
import { PostCardSkeleton } from "../../../components/common/skeleton/post-card-skeleton"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { DataPagination } from "@/components/common/data-pagination"
import { PaginationInfo } from "@/components/common/pagination-info"
import { type Post } from "@/schemas/post.schema"
import { handleError } from "@/utils/handleError"
import { SortOrder } from "@/constants/sort"
import type { Pagination } from "@/constants/pagination"

export default function CommunityPage() {
    const [page, setPage] = useState(1)
    const [searchValue, setSearchValue] = useState("")
    const [search, setSearch] = useState<string | undefined>(undefined)
    const [sortOrder, setSortOrder] = useState<string>(SortOrder.DESC)
    const { data: postsData, isLoading } = usePosts({ page, limit: 20, search, sortOrder: sortOrder as SortOrder })

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchValue || undefined)
        setPage(1)
    }, [searchValue])

    const handleClearSearch = useCallback(() => {
        setSearchValue("")
        setSearch(undefined)
        setPage(1)
    }, [])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deletePostId, setDeletePostId] = useState<string | null>(null)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportPostId, setReportPostId] = useState<string | null>(null)
    const [commentPostId, setCommentPostId] = useState<string | null>(null)
    const user = useAuthStore((s) => s.user)
    const deleteMutation = useDeletePost()
    const toggleLikeMutation = useTogglePostLike()
    const reportMutation = useReportPost()

    const posts = (postsData?.data ?? []) as Post[]
    const meta = postsData?.meta as Pagination | undefined
    const totalPages = meta ? Math.ceil((meta.total ?? 0) / (meta.limit ?? 20)) : 0

    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setDialogOpen(true)
    }

    const handleCloseDialog = (open: boolean) => {
        setDialogOpen(open)
        if (!open) setEditingPost(null)
    }

    const handleComment = (id: string) => {
        setCommentPostId(id)
    }

    const handleToggleLike = async (id: string) => {
        try {
            await toggleLikeMutation.mutateAsync(id, {
                onSuccess: (res: any) => {
                    const liked = res?.data?.data?.liked
                    toast.success(res?.data?.message || (liked ? "Đã thích bài viết" : "Đã bỏ thích bài viết"))
                },
                onError: (err: any) => {
                    handleError(err, "Thao tác thất bại")
                },
            })
        } catch (error) {
            console.error("Toggle like failed", error)
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
                onError: (err: any) => {
                    handleError(err, "Báo cáo thất bại")
                },
            })
        } catch (error) {
            console.error("Report post failed", error)
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
                onError: (err: any) => {
                    handleError(err, "Xóa bài viết thất bại")
                },
            })
        } catch (error) {
            console.error("Delete post failed", error)
        }
    }

    return (
        <div className="w-full space-y-6">
            <div className="rounded-3xl border border-beige bg-white p-4 md:p-5 flex items-center gap-4 hover:border-terracotta/20 hover:shadow-sm hover:shadow-terracotta/5 transition-all duration-300">
                <UserAvatar
                    avatarUrl={user?.avatarUrl}
                    fullName={user?.displayName}
                    username={user?.username}
                    className="size-9 rounded-2xl"
                />
                <button
                    onClick={() => setDialogOpen(true)}
                    className="flex-1 h-11 rounded-2xl bg-cream hover:bg-cream/80 border border-beige px-5 text-left text-text-muted/70 text-sm font-semibold transition-all focus:outline-none flex items-center"
                >
                    Chia sẻ deck với mọi người...
                </button>
            </div>

            <PostFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                sortOrder={sortOrder}
                onSortOrderChange={(v) => { setSortOrder(v); setPage(1) }}
            />

            {isLoading ? (
                <div className="space-y-6">
                    <PostCardSkeleton />
                    <PostCardSkeleton />
                    <PostCardSkeleton />
                </div>
            ) : posts.length === 0 ? (
                <EmptyState
                    title="Chưa có bài viết nào"
                    description="Hãy là người đầu tiên chia sẻ deck lên cộng đồng nhé!"
                />
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onEdit={handleEdit}
                        onDelete={handleDeleteTrigger}
                        onToggleLike={handleToggleLike}
                        onComment={handleComment}
                        onReport={handleReportTrigger}
                        currentUserId={user?.id}
                    />
                ))
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <PaginationInfo
                        page={meta?.page ?? 1}
                        limit={meta?.limit ?? 20}
                        totalItems={meta?.total ?? 0}
                        currentLength={posts.length}
                        label="bài viết"
                        className="text-sm text-text-muted"
                    />
                    <DataPagination
                        page={meta?.page ?? 1}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <PostDialog
                open={dialogOpen}
                onOpenChange={handleCloseDialog}
                initialData={editingPost ?? undefined}
            />

            <PostCommentDialog
                postId={commentPostId ?? ""}
                open={!!commentPostId}
                onOpenChange={(open) => { if (!open) setCommentPostId(null) }}
            />

            <PostReportDialog
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
                onConfirm={handleReportConfirm}
                loading={reportMutation.isPending}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleConfirmDelete}
                loading={deleteMutation.isPending}
            />
        </div>
    )
}
