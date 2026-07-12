"use client"

import Link from "next/link"
import { ArrowRight, Folder, Loader2, MessageCircle, Heart } from "lucide-react"
import { Title } from "@/components/common/title"
import { UserAvatar } from "@/components/common/user-avatar"
import { usePosts } from "@/queries/usePostQuery"
import { SortOrder } from "@/constants/sort"
import { timeAgo } from "@/utils/timeAgo"
import type { Post } from "@/schemas/post.schema"

const folderColors = ["bg-peach", "bg-blue-soft", "bg-yellow-soft", "bg-green-soft", "bg-purple-soft"]

function color(index: number) {
    return folderColors[index % folderColors.length]
}

export function CommunityPostsSection() {
    const { data: res, isLoading } = usePosts({ limit: 3, sortOrder: SortOrder.DESC })
    const posts = (res?.data ?? []) as Post[]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-terracotta" />
            </div>
        )
    }

    if (posts.length === 0) return null

    return (
        <section className="mx-auto px-8 py-20">
            <div className="mx-auto mb-14 max-w-3xl text-center">
                <Title title="Latest from Community" className="text-5xl" />
                <p className="mt-5 text-lg leading-8 text-text-muted">
                    Khám phá những chia sẻ và bộ từ vựng hữu ích từ cộng đồng Recalio.
                </p>
            </div>
            <div className="space-y-6">
                {posts.slice(0, 1).map((post) => (
                    <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="group block rounded-3xl border border-beige bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-lg hover:shadow-terracotta/5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <UserAvatar
                                avatarUrl={post.user?.avatarUrl}
                                fullName={post.user?.displayName}
                                username={post.user?.username}
                                className="size-10 rounded-xl"
                            />
                            <div>
                                <p className="font-semibold text-text-primary">{post.user?.displayName || post.user?.username}</p>
                                <p className="text-sm text-text-muted">{timeAgo(post.createdAt)}</p>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary transition-colors group-hover:text-terracotta mb-3">
                            {post.title}
                        </h3>
                        {post.content && (
                            <p className="line-clamp-3 text-text-muted leading-relaxed">{post.content}</p>
                        )}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="rounded-full bg-peach/40 px-3 py-1 text-xs font-semibold text-terracotta">#{tag}</span>
                                ))}
                            </div>
                        )}
                        {post.decks && post.decks.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-5">
                                {post.decks.slice(0, 3).map((deck, i) => (
                                    <span key={deck.id} className="inline-flex items-center gap-1.5 rounded-full border border-beige bg-cream px-3 py-1.5 text-xs font-semibold text-text-primary">
                                        <div className={`flex size-5 items-center justify-center rounded-md ${color(i)}`}>
                                            <Folder className="size-3 text-terracotta" />
                                        </div>
                                        {deck.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-4 mt-5 text-sm text-text-muted">
                            <span className="flex items-center gap-1"><Heart className="size-4" /> {post.likeCount}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="size-4" /> {post._count.comments}</span>
                            <span className="ml-auto flex items-center gap-1 font-semibold text-terracotta group-hover:gap-2 transition-all">
                                Đọc tiếp <ArrowRight className="size-4" />
                            </span>
                        </div>
                    </Link>
                ))}
                {posts.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.slice(1).map((post) => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="group block rounded-3xl border border-beige bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-lg hover:shadow-terracotta/5"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <UserAvatar
                                        avatarUrl={post.user?.avatarUrl}
                                        fullName={post.user?.displayName}
                                        username={post.user?.username}
                                        className="size-8 rounded-lg"
                                    />
                                    <p className="font-semibold text-sm text-text-primary">{post.user?.displayName || post.user?.username}</p>
                                </div>
                                <h3 className="text-lg font-bold text-text-primary transition-colors group-hover:text-terracotta mb-2">
                                    {post.title}
                                </h3>
                                {post.content && (
                                    <p className="line-clamp-2 text-sm text-text-muted">{post.content}</p>
                                )}
                                {post.decks && post.decks.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {post.decks.slice(0, 2).map((deck, i) => (
                                            <span key={deck.id} className="inline-flex items-center gap-1 rounded-full border border-beige bg-cream px-2.5 py-1 text-[11px] font-semibold text-text-primary">
                                                <div className={`flex size-4 items-center justify-center rounded ${color(i)}`}>
                                                    <Folder className="size-2.5 text-terracotta" />
                                                </div>
                                                {deck.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mt-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><Heart className="size-3.5" /> {post.likeCount}</span>
                                    <span className="flex items-center gap-1"><MessageCircle className="size-3.5" /> {post._count.comments}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
