"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { SortOrder } from "@/constants/sort"
import { DataPagination } from "@/components/common/data-pagination"
import { FollowCard } from "@/components/common/follow-card"
import { EmptyState } from "@/components/common/empty-state"
import { useUserFollowing, useUnfollowUser } from "@/queries/useFollowQuery"

const PAGE_SIZE = 10

export function ProfileFollowingTab({ userId }: { userId: string }) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const { data: res, isLoading } = useUserFollowing(userId, { page, limit: PAGE_SIZE, sortOrder: SortOrder.DESC })
    const unfollowUser = useUnfollowUser()

    const items = (res?.data ?? []) as any[]
    const totalPages = Math.ceil((res as any)?.meta?.total / PAGE_SIZE) || 1

    const filtered = search
        ? items.filter((u) =>
            u.displayName.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase())
        )
        : items

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm người đang follow..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-terracotta" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="Chưa theo dõi ai" description={search ? "Thử tìm kiếm với từ khóa khác." : "Bạn chưa theo dõi người dùng nào."} />
            ) : (
                <div className="space-y-2">
                    {filtered.map((u) => (
                        <FollowCard
                            key={u.id}
                            user={u}
                            onUnfollow={unfollowUser.mutate}
                            pending={unfollowUser.isPending}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <DataPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    )
}
