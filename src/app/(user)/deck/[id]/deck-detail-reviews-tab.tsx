"use client"

import React from "react"
import { Star, Loader2Icon, SendHorizontal, Trash2 } from "lucide-react"
import { StarRating } from "@/components/common/star-rating"
import { UserAvatar } from "@/components/common/user-avatar"
import { DataPagination } from "@/components/common/data-pagination"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import { useReviewsByDeck, useDeleteReview, useUpsertReview } from "@/queries/useReviewQuery"
import { useAuthStore } from "@/stores/useAuthStore"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"
import { SortOrder } from "@/constants/sort"
import type { Review } from "@/schemas/review.schema"

interface ReviewsTabProps {
    deckId: string
    isOwner: boolean
}

export function ReviewsTab({ deckId, isOwner }: ReviewsTabProps) {
    const [page, setPage] = React.useState(1)
    const [rating, setRating] = React.useState(0)
    const [comment, setComment] = React.useState("")
    const user = useAuthStore((s) => s.user)
    const upsertReview = useUpsertReview()
    const deleteReview = useDeleteReview()

    const { data: res, isLoading } = useReviewsByDeck(deckId, { page, limit: 10, sortOrder: SortOrder.DESC, sort: "createdAt" })
    const reviews: Review[] = (res as any)?.data ?? []
    const meta = (res as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) return
        try {
            await upsertReview.mutateAsync({ deckId, data: { rating, comment: comment || undefined } })
            toast.success("Đánh giá thành công")
            setRating(0)
            setComment("")
        } catch (err) {
            handleError(err)
        }
    }

    return (
        <div className="space-y-6">
            {!isOwner && user && (
                <form onSubmit={handleSubmit} className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-black text-text-primary tracking-tight">Đánh giá của bạn</h3>
                    <div className="mb-4">
                        <p className="mb-2 text-sm font-semibold text-text-muted">Chất lượng deck</p>
                        <StarRating value={rating} onChange={setRating} size={24} />
                    </div>
                    <textarea
                        placeholder="Chia sẻ cảm nhận của bạn về deck này..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-beige bg-off-white p-4 text-sm font-medium text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={rating === 0 || upsertReview.isPending}
                            className="rounded-xl bg-terracotta px-6 text-sm font-bold text-white hover:bg-terracotta-dark"
                        >
                            <SendHorizontal className="mr-2 size-4" />
                            {upsertReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
                        </Button>
                    </div>
                </form>
            )}

            <div>
                <h3 className="mb-4 text-lg font-black text-text-primary tracking-tight">
                    Tất cả đánh giá ({meta?.total ?? 0})
                </h3>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2Icon className="size-8 animate-spin text-terracotta" />
                    </div>
                ) : reviews.length === 0 ? (
                    <EmptyState title="Chưa có đánh giá nào" description="Hãy là người đầu tiên đánh giá deck này." />
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl border border-beige bg-off-white p-5">
                                <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                avatarUrl={review.user?.avatarUrl}
                                                fullName={review.user?.displayName}
                                                username={review.user?.username}
                                                className="size-9 border-2 border-beige"
                                            />
                                            <div>
                                                <p className="font-bold text-text-primary text-sm">
                                                    {review.user?.displayName || review.user?.username || "Unknown"}
                                                </p>
                                                <p className="text-[10px] font-semibold text-text-muted">
                                                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                        </div>
                                        {review.user?.id === user?.id && (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        await deleteReview.mutateAsync(review.id)
                                                        toast.success("Đã xoá đánh giá")
                                                    } catch (err) {
                                                        handleError(err)
                                                    }
                                                }}
                                                disabled={deleteReview.isPending}
                                                className="rounded-lg p-1.5 text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    <div className="flex gap-0.5 text-gold-dark">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star
                                                key={s}
                                                className={`size-3.5 ${s < review.rating ? "fill-current" : "text-beige"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-sm font-medium text-text-primary/90 pl-1 leading-relaxed">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                )}
                            </div>
                        ))}

                        {totalPages > 1 && (
                            <div className="pt-2">
                                <DataPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
