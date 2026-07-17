"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Loader2, Folder, FileText, Users, Layers, Hash, User } from "lucide-react"
import { useSearch } from "@/queries/useSearchQuery"
import type { SearchParams as SearchParamsType } from "@/services/search.service"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { PaginationInfo } from "@/components/common/pagination-info"
import { DataPagination } from "@/components/common/data-pagination"
import { Pagination } from "@/constants/pagination"
import { timeAgo } from "@/utils/timeAgo"
import { getColor } from "@/utils/getColor"

const ITEMS_PER_PAGE = 10

const entityTabs = [
    { value: "all", label: "Tất cả" },
    { value: "decks", label: "Bộ thẻ" },
    { value: "posts", label: "Bài viết" },
    { value: "users", label: "Người dùng" },
] as const

export default function SearchPage() {
    const router = useRouter()
    const sp = useSearchParams()
    const q = sp.get("q") || ""
    const entity = (sp.get("entity") as SearchParamsType["entity"]) || "all"

    const [inputValue, setInputValue] = useState(q)
    const [page, setPage] = useState(1)

    useEffect(() => { setInputValue(q); setPage(1) }, [q, entity])

    const { data, isLoading } = useSearch(
        { q, entity, page, limit: ITEMS_PER_PAGE } as SearchParamsType,
        { enabled: q.length > 0 },
    )

    const result = (data as any)?.data as {
        decks: { data: any[]; total: number }
        posts: { data: any[]; total: number }
        users: { data: any[]; total: number }
    } | undefined

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = inputValue.trim()
        if (!trimmed) return
        const params = new URLSearchParams()
        params.set("q", trimmed)
        if (entity !== "all") params.set("entity", entity)
        if (page > 1) params.set("page", String(page))
        router.push(`/search?${params.toString()}`)
    }, [inputValue, entity, page, router])

    const switchEntity = useCallback((e: string) => {
        const params = new URLSearchParams()
        params.set("q", q)
        if (e !== "all") params.set("entity", e)
        router.push(`/search?${params.toString()}`)
    }, [q, router])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") { setInputValue(q) }
    }, [q])

    return (
        <div className="space-y-6">
            <Title title="Tìm kiếm" description="Tìm bộ thẻ, bài viết và người dùng" />

            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập từ khóa tìm kiếm..."
                    className="w-full h-14 rounded-2xl border border-beige bg-white pl-12 pr-4 text-base text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-terracotta focus:ring-2 focus:ring-terracotta/10"
                />
            </form>

            {q && (
                <div className="flex gap-2">
                    {entityTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => switchEntity(tab.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                entity === tab.value
                                    ? "bg-terracotta text-white"
                                    : "bg-white border border-beige text-text-muted hover:border-terracotta/30 hover:text-text-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {!q && (
                <EmptyState
                    icon={<Search className="size-10 text-terracotta" />}
                    title="Nhập từ khóa để tìm kiếm"
                    description="Tìm kiếm bộ thẻ, bài viết và người dùng trên Recalio"
                />
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 animate-spin text-terracotta" />
                </div>
            )}

            {!isLoading && q && result && (
                <div className="space-y-10">
                    {entity === "all" || entity === "users" ? (
                        <Section
                            icon={<Users className="size-5" />}
                            title="Người dùng"
                            count={result.users.total}
                            empty="Không tìm thấy người dùng nào"
                        >
                            {result.users.data.map((user: any) => (
                                <Link
                                    key={user.id}
                                    href={`/profile/${user.username}`}
                                    className="flex items-center gap-4 rounded-2xl border border-beige bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-terracotta/30 hover:shadow-sm"
                                >
                                    <div className={`flex size-12 items-center justify-center rounded-2xl ${getColor(user.id)}`}>
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="" className="size-full rounded-2xl object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-white">{user.displayName[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-text-primary truncate">{user.displayName}</p>
                                        <p className="text-sm text-text-muted">@{user.username}</p>
                                        {user.bio && <p className="text-sm text-text-muted truncate mt-0.5">{user.bio}</p>}
                                    </div>
                                </Link>
                            ))}
                        </Section>
                    ) : null}

                    {entity === "all" || entity === "decks" ? (
                        <Section
                            icon={<Folder className="size-5" />}
                            title="Bộ thẻ"
                            count={result.decks.total}
                            empty="Không tìm thấy bộ thẻ nào"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.decks.data.map((deck: any) => (
                                    <Link
                                        key={deck.id}
                                        href={`/deck/${deck.id}`}
                                        className="group relative overflow-hidden rounded-3xl border border-beige bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-md"
                                    >
                                        <div className={`relative h-32 w-full flex items-center justify-center ${getColor(deck.id)}`}>
                                            {deck.coverImage ? (
                                                <img src={deck.coverImage} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/40 shadow-inner backdrop-blur-sm">
                                                    <Folder className="size-6 text-white" fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-text-primary truncate group-hover:text-terracotta transition-colors">{deck.name}</h3>
                                            {deck.description && <p className="mt-1 text-sm text-text-muted line-clamp-2">{deck.description}</p>}
                                            <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                                                <span className="flex items-center gap-1"><Layers className="size-3.5" />{deck._count?.cards ?? 0} cards</span>
                                                <span className="flex items-center gap-1"><Hash className="size-3.5" />{deck.downloadCount ?? 0}</span>
                                            </div>
                                            {deck.user && (
                                                <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                                                    <User className="size-3" />
                                                    <span>{deck.user.displayName || deck.user.username}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {entity === "all" || entity === "posts" ? (
                        <Section
                            icon={<FileText className="size-5" />}
                            title="Bài viết"
                            count={result.posts.total}
                            empty="Không tìm thấy bài viết nào"
                        >
                            {result.posts.data.map((post: any) => (
                                <Link
                                    key={post.id}
                                    href={`/community`}
                                    className="block rounded-2xl border border-beige bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-terracotta/30 hover:shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${getColor(post.id)}`}>
                                            <FileText className="size-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-text-primary truncate">{post.title}</h3>
                                            {post.content && <p className="mt-1 text-sm text-text-muted line-clamp-2">{post.content}</p>}
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <User className="size-3" />{post.user?.displayName || post.user?.username}
                                                </span>
                                                <span>{timeAgo(post.createdAt)}</span>
                                                {post.tags?.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Hash className="size-3" />{post.tags.length} tags
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </Section>
                    ) : null}
                </div>
            )}
        </div>
    )
}

function Section({
    icon,
    title,
    count,
    empty,
    children,
}: {
    icon: React.ReactNode
    title: string
    count: number
    empty: string
    children: React.ReactNode
}) {
    if (count === 0) return null
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex size-8 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">{icon}</div>
                <h2 className="text-lg font-bold text-text-primary">{title}</h2>
                <span className="text-sm text-text-muted">({count})</span>
            </div>
            {children}
        </div>
    )
}
