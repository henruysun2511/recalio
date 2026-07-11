"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/common/user-avatar"
import { Loader2Icon, Heart, MessageCircle, SendHorizonalIcon, ChevronDownIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { usePostComments, useCommentReplies, useCreateComment, useUpdateComment, useDeleteComment, useToggleCommentLike } from "@/queries/usePostCommentQuery"
import { useAuthStore } from "@/stores/useAuthStore"
import { handleError } from "@/utils/handleError"
import { timeAgo } from "@/utils/timeAgo"
import type { PostComment } from "@/schemas/post-comment.schema"

interface PostCommentDialogProps {
    postId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

function ReplyList({ commentId }: { commentId: string }) {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useCommentReplies(commentId, { page, limit: 10 })
    const replies = (data as any)?.data ?? []
    const meta = (data as any)?.meta
    const total = meta?.total ?? 0
    const loaded = page * 10

    if (isLoading && page === 1) {
        return <div className="flex justify-center py-2"><Loader2Icon className="size-4 animate-spin text-text-muted" /></div>
    }

    if (replies.length === 0) return null

    return (
        <div className="ml-10 space-y-2 border-l-2 border-beige pl-3 mt-4">
            {replies.map((reply: PostComment) => (
                <ReplyItem key={reply.id} reply={reply} />
            ))}
            {loaded < total && (
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs text-terracotta hover:text-terracotta-dark font-semibold"
                >
                    Xem thêm {Math.min(10, total - loaded)} trả lời
                </button>
            )}
        </div>
    )
}

function ReplyItem({ reply }: { reply: PostComment }) {
    const toggleLike = useToggleCommentLike()
    const updateComment = useUpdateComment()
    const deleteComment = useDeleteComment()
    const user = useAuthStore((s) => s.user)
    const [editing, setEditing] = useState(false)
    const [editContent, setEditContent] = useState(reply.content)
    const isOwner = user?.id === reply.userId

    const handleSaveEdit = async () => {
        const content = editContent.trim()
        if (!content) return
        try {
            await updateComment.mutateAsync({ commentId: reply.id, data: { content } }, {
                onSuccess: (res: any) => {
                    toast.success(res?.data?.message || "Đã cập nhật bình luận")
                    setEditing(false)
                },
                onError: (err: any) => handleError(err, "Cập nhật thất bại"),
            })
        } catch (error) {
            console.error("Edit reply failed", error)
        }
    }

    const handleDelete = () => {
        deleteComment.mutate(reply.id, {
            onSuccess: (res: any) => toast.success(res?.data?.message || "Đã xóa bình luận"),
            onError: (err: any) => handleError(err, "Xóa thất bại"),
        })
    }

    return (
        <div className="flex gap-2">
            <UserAvatar
                avatarUrl={reply.user?.avatarUrl}
                fullName={reply.user?.displayName}
                username={reply.user?.username}
                className="size-8 rounded-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{reply.user?.displayName || reply.user?.username}</span>
                    <span className="text-xs text-text-muted/60">{timeAgo(reply.createdAt)}</span>
                </div>
                {editing ? (
                    <div className="mt-1 space-y-2">
                        <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="admin-form-input h-9 text-sm" />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} disabled={updateComment.isPending} className="h-8 px-3 rounded-lg bg-terracotta text-white text-xs">Lưu</Button>
                            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditContent(reply.content) }} className="h-8 px-3 rounded-lg text-xs">Hủy</Button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-0.5 text-sm text-text-primary break-words">{reply.content}</p>
                )}
                <div className="mt-1 flex items-center gap-2">
                    <button onClick={() => toggleLike.mutate(reply.id)} className="flex items-center gap-0.5 text-xs text-text-muted hover:text-red-500 transition-colors">
                        <Heart className={`size-[11px] ${reply.likeCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                        {reply.likeCount > 0 && reply.likeCount}
                    </button>
                    {isOwner && !editing && (
                        <>
                            <button onClick={() => { setEditContent(reply.content); setEditing(true) }} className="text-xs text-text-muted hover:text-terracotta transition-colors">
                                <PencilIcon className="size-[11px]" />
                            </button>
                            <button onClick={handleDelete} className="text-xs text-text-muted hover:text-red-500 transition-colors">
                                <Trash2Icon className="size-[11px]" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function CommentItem({ comment, postId, onReply }: { comment: PostComment; postId: string; onReply: (parentId: string, username: string) => void }) {
    const toggleLike = useToggleCommentLike()
    const updateComment = useUpdateComment()
    const deleteComment = useDeleteComment()
    const user = useAuthStore((s) => s.user)
    const [showReplies, setShowReplies] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const replyCount = comment._count?.replies ?? 0
    const isOwner = user?.id === comment.userId

    const handleSaveEdit = async () => {
        const content = editContent.trim()
        if (!content) return
        try {
            await updateComment.mutateAsync({ commentId: comment.id, data: { content } }, {
                onSuccess: (res: any) => {
                    toast.success(res?.data?.message || "Đã cập nhật bình luận")
                    setEditing(false)
                },
                onError: (err: any) => handleError(err, "Cập nhật thất bại"),
            })
        } catch (error) {
            console.error("Edit comment failed", error)
        }
    }

    const handleDelete = () => {
        deleteComment.mutate(comment.id, {
            onSuccess: (res: any) => toast.success(res?.data?.message || "Đã xóa bình luận"),
            onError: (err: any) => handleError(err, "Xóa thất bại"),
        })
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <UserAvatar
                    avatarUrl={comment.user?.avatarUrl}
                    fullName={comment.user?.displayName}
                    username={comment.user?.username}
                    className="size-8 rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">{comment.user?.displayName || comment.user?.username}</span>
                        <span className="text-xs text-text-muted/60">{timeAgo(comment.createdAt)}</span>
                    </div>
                    {editing ? (
                        <div className="mt-1 space-y-2">
                            <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="admin-form-input h-9 text-sm" />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit} disabled={updateComment.isPending} className="h-8 px-3 rounded-lg bg-terracotta text-white text-xs">Lưu</Button>
                                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditContent(comment.content) }} className="h-8 px-3 rounded-lg text-xs">Hủy</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-0.5 text-sm text-text-primary break-words">{comment.content}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                        <button onClick={() => toggleLike.mutate(comment.id)} className="flex items-center gap-0.5 text-xs text-text-muted hover:text-red-500 transition-colors">
                            <Heart className={`size-[11px] ${comment.likeCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                            {comment.likeCount > 0 && comment.likeCount}
                        </button>
                        <button onClick={() => onReply(comment.id, comment.user?.displayName || comment.user?.username || "")} className="flex items-center gap-0.5 text-xs text-text-muted hover:text-terracotta transition-colors">
                            <MessageCircle className="size-[11px]" />
                            Trả lời
                        </button>
                        {replyCount > 0 && (
                            <button onClick={() => setShowReplies((v) => !v)} className="flex items-center gap-0.5 text-xs text-text-muted hover:text-terracotta transition-colors">
                                <ChevronDownIcon className={`size-[11px] transition-transform ${showReplies ? "rotate-180" : ""}`} />
                                {showReplies ? "Ẩn" : `${replyCount} trả lời`}
                            </button>
                        )}
                        {isOwner && !editing && (
                            <>
                                <button onClick={() => { setEditContent(comment.content); setEditing(true) }} className="text-xs text-text-muted hover:text-terracotta transition-colors">
                                    <PencilIcon className="size-[11px]" />
                                </button>
                                <button onClick={handleDelete} className="text-xs text-text-muted hover:text-red-500 transition-colors">
                                    <Trash2Icon className="size-[11px]" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showReplies && <ReplyList commentId={comment.id} />}
        </div>
    )
}

export function PostCommentDialog({ postId, open, onOpenChange }: PostCommentDialogProps) {
    const [page, setPage] = useState(1)
    const { data: commentsData, isLoading } = usePostComments(postId, { page, limit: 10 })
    const createComment = useCreateComment()
    const user = useAuthStore((s) => s.user)
    const [commentInput, setCommentInput] = useState("")
    const [replyingTo, setReplyingTo] = useState<{ parentId: string; username: string } | null>(null)

    const comments = (commentsData as any)?.data ?? []
    const meta = (commentsData as any)?.meta
    const total = meta?.total ?? 0
    const loaded = page * 10

    const handleSubmit = async () => {
        const content = commentInput.trim()
        if (!content) return
        try {
            await createComment.mutateAsync(
                { postId, data: { content, parentId: replyingTo?.parentId } },
                {
                    onSuccess: (res: any) => {
                        toast.success(res?.data?.message || "Đã bình luận")
                        setCommentInput("")
                        setReplyingTo(null)
                    },
                    onError: (err: any) => {
                        handleError(err, "Bình luận thất bại")
                    },
                },
            )
        } catch (error) {
            console.error("Comment failed", error)
        }
    }

    const handleReply = useCallback((parentId: string, username: string) => {
        setReplyingTo({ parentId, username })
    }, [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-none sm:max-w-[800px] p-0 gap-0 admin-dialog-content">
                <DialogHeader className="admin-dialog-header px-4 pt-4 pb-0">
                    <DialogTitle className="admin-dialog-title text-base">Bình luận</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(65vh-120px)] px-4 py-3 space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2Icon className="size-6 animate-spin text-text-muted" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-sm text-text-muted py-12">Chưa có bình luận nào.</p>
                    ) : (
                        <>
                            {comments.map((comment: PostComment) => (
                                <CommentItem key={comment.id} comment={comment} postId={postId} onReply={handleReply} />
                            ))}
                            {loaded < total && (
                                <div className="flex justify-center pt-2">
                                    <Button variant="ghost" onClick={() => setPage((p) => p + 1)} className="text-terracotta text-sm font-semibold">
                                        Xem thêm {Math.min(10, total - loaded)} bình luận
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="border-t border-beige p-3 space-y-2 flex-shrink-0">
                    {replyingTo && (
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span>Đang trả lời <strong className="text-text-primary">{replyingTo.username}</strong></span>
                            <button onClick={() => { setReplyingTo(null); setCommentInput("") }} className="text-red-500 hover:text-red-600 font-semibold">Hủy</button>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <UserAvatar
                            avatarUrl={user?.avatarUrl}
                            fullName={user?.displayName}
                            username={user?.username}
                            className="size-9 rounded-xl shrink-0"
                        />
                        <div className="flex-1 flex items-center gap-2">
                            <Input
                                placeholder={replyingTo ? `Trả lời ${replyingTo.username}...` : "Viết bình luận..."}
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
                                className="admin-form-input h-10 text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={handleSubmit}
                                disabled={!commentInput.trim() || createComment.isPending}
                                className="shrink-0 size-10 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white"
                            >
                                {createComment.isPending ? <Loader2Icon className="size-4 animate-spin" /> : <SendHorizonalIcon className="size-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
