import Link from "next/link"
import {
    ArrowRight,
    Globe,
    Heart,
    Lock,
    MessageCircle,
    MoreHorizontal,
    Flag,
    Folder,
} from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { UserAvatar } from "@/components/common/user-avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type Post } from "@/schemas/post.schema"
import { timeAgo } from "@/utils/timeAgo"

interface Props {
    post: Post
    onEdit?: (post: Post) => void
    onDelete?: (id: string) => void
    onToggleLike?: (id: string) => void
    onComment?: (id: string) => void
    onReport?: (id: string) => void
    currentUserId?: string
}

const folderColors = ["bg-peach", "bg-blue-soft", "bg-yellow-soft", "bg-green-soft", "bg-purple-soft"]

function color(index: number) {
    return folderColors[index % folderColors.length]
}

export function PostCard({ post, onEdit, onDelete, onToggleLike, onComment, onReport, currentUserId }: Props) {
    const commentCount = post._count.comments
    const decks = post.decks
    return (
        <article className="group rounded-3xl border border-beige bg-white p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-md hover:shadow-terracotta/5">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <UserAvatar
                        avatarUrl={post.user?.avatarUrl}
                        fullName={post.user?.displayName}
                        username={post.user?.username}
                        className="size-10 rounded-2xl"
                    />
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="font-bold text-text-primary transition-colors group-hover:text-terracotta">
                                {post.user?.displayName || post.user?.username}
                            </h3>
                            <span className="text-sm text-text-muted">@{post.user?.username}</span>
                            <span className="text-xs text-text-muted/60">•</span>
                            <span className="text-sm text-text-muted">{timeAgo(post.createdAt)}</span>
                            {post.isPublished ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-soft/75 px-2 py-0.5 text-[10px] font-semibold text-green-700 ml-1">
                                    <Globe className="size-2.5" /> Public
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-beige/75 px-2 py-0.5 text-[10px] font-semibold text-text-muted ml-1">
                                    <Lock className="size-2.5" /> Private
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {currentUserId === post.user.id && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-28 rounded-xl">
                            {onEdit && <DropdownMenuItem onClick={() => onEdit(post)}>Chỉnh sửa</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            {onDelete && <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600 focus:bg-red-50 focus:text-red-600">Xóa</DropdownMenuItem>}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <Link href={`/posts/${post.id}`}>
                <h2 className="mt-5 text-xl md:text-2xl font-bold tracking-tight text-text-primary transition-colors hover:text-terracotta">
                    {post.title}
                </h2>
            </Link>

            {post.content && (
                <p className="mt-3 line-clamp-4 text-sm md:text-base leading-relaxed text-text-muted">{post.content}</p>
            )}

            {post.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-peach/40 hover:bg-peach/70 transition-colors duration-200 cursor-pointer px-3 py-1 text-xs font-semibold text-terracotta">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {decks.length > 0 && (
                <div className="mt-8">
                    <p className="mb-4 text-sm font-semibold text-text-primary">Related Decks</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {decks.map((deck, index) => (
                            <Link
                                key={deck.id}
                                href={`/decks/${deck.id}`}
                                className="group/deck rounded-2xl border border-beige bg-cream p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-terracotta/30 hover:bg-white hover:shadow-sm"
                            >
                                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover/deck:scale-105 ${color(index)}`}>
                                    <Folder className="size-5 text-terracotta" fill="currentColor" />
                                </div>
                                <h4 className="line-clamp-1 text-sm font-semibold text-text-primary">{deck.name}</h4>
                                <p className="mt-0.5 text-xs text-text-muted">{deck._count?.cards ?? 0} cards</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-beige pt-6">
                <div className="flex items-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={() => onToggleLike?.(post.id)}
                                className={`rounded-xl transition-colors duration-200 ${post.isLiked ? "text-red-500 hover:bg-red-50/80" : "text-text-muted hover:text-red-500 hover:bg-red-50/80"}`}
                            >
                                <Heart className={`mr-2 size-4 ${post.isLiked ? "fill-red-500" : ""}`} /> {post.likeCount}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Thích</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" onClick={() => onComment?.(post.id)} className="rounded-xl text-text-muted hover:text-terracotta hover:bg-peach/20 transition-colors duration-200">
                                <MessageCircle className="mr-2 size-4" /> {commentCount}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bình luận</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onReport?.(post.id)} className="rounded-xl text-text-muted hover:text-amber-500 hover:bg-amber-50/80 transition-colors duration-200">
                                <Flag className="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Báo cáo</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </article>
    )
}
