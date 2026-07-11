"use client"

import { useMemo, useState } from "react"
import {
    Search, Plus, Folder, Loader2, Copy, Archive, Download,
} from "lucide-react"
import { EmptyState } from "@/components/common/empty-state"
import { DeckCard2 } from "@/components/common/deck-card-2"
import {
    useMyDecks, usePublicDecks, useClonedDecks, useArchivedDecks,
} from "@/queries/useDeckQuery"
import type { DeckResponse } from "@/schemas/deck.schema"

function getParent(fullPath: string | null): string {
    if (!fullPath) return "Khác"
    const parts = fullPath.split("::")
    return parts.length > 1 ? parts[0] : "Khác"
}

const EMPTY_DECKS: DeckResponse[] = []

type OwnTab = "own" | "cloned" | "archived"

export function ProfileDecksTab({ userId }: { userId?: string }) {
    const [search, setSearch] = useState("")
    const [filterPublic, setFilterPublic] = useState<boolean | undefined>(undefined)
    const [ownTab, setOwnTab] = useState<OwnTab>("own")

    const isPublicView = !!userId

    const ownQuery = useMyDecks(
        isPublicView ? undefined : { search: search || undefined, isPublic: filterPublic },
        { enabled: !isPublicView },
    )
    const publicQuery = usePublicDecks(
        isPublicView ? { userId, search: search || undefined } : undefined,
        { enabled: isPublicView },
    )
    const clonedQuery = useClonedDecks(
        !isPublicView && ownTab === "cloned" ? { search: search || undefined } : undefined,
        { enabled: !isPublicView && ownTab === "cloned" },
    )
    const archivedQuery = useArchivedDecks(
        !isPublicView && ownTab === "archived" ? { search: search || undefined } : undefined,
        { enabled: !isPublicView && ownTab === "archived" },
    )

    const queries: Record<OwnTab, typeof ownQuery> = { own: ownQuery, cloned: clonedQuery, archived: archivedQuery }
    const activeQuery = isPublicView ? publicQuery : queries[ownTab]
    const { isLoading } = activeQuery
    const decks = (activeQuery.data?.data ?? EMPTY_DECKS) as DeckResponse[]

    const grouped = useMemo(() => {
        if (isPublicView || ownTab !== "own") return null
        const map = new Map<string, DeckResponse[]>()
        for (const d of decks) {
            const parent = getParent(d.fullPath)
            if (!map.has(parent)) map.set(parent, [])
            map.get(parent)!.push(d)
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    }, [decks, isPublicView, ownTab])

    const tabConfig: { key: OwnTab; label: string; icon: typeof Folder }[] = [
        { key: "own", label: "Bộ thẻ", icon: Folder },
        { key: "cloned", label: "Đã clone", icon: Copy },
        { key: "archived", label: "Đã lưu trữ", icon: Archive },
    ]

    const emptyStates: Record<string, { icon: typeof Folder; title: string; description: string; action?: string }> = {
        own: { icon: Folder, title: "Chưa có bộ thẻ nào", description: "Tạo bộ thẻ mới để bắt đầu học tập" },
        cloned: { icon: Copy, title: "Chưa clone bộ thẻ nào", description: "Khám phá bộ thẻ public từ cộng đồng" },
        archived: { icon: Archive, title: "Chưa có bộ thẻ nào được lưu trữ", description: "Lưu trữ bộ thẻ để tập trung vào những thứ quan trọng hơn" },
        public: { icon: Folder, title: "Người dùng chưa có bộ thẻ public nào", description: "" },
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm bộ thẻ..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                    />
                </div>

                {!isPublicView && (
                    <>
                        {ownTab === "own" && (
                            <div className="flex items-center gap-1.5 rounded-xl border border-beige bg-white p-1">
                                {[
                                    { label: "Tất cả", value: undefined },
                                    { label: "Public", value: true as const },
                                    { label: "Private", value: false as const },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setFilterPublic(opt.value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            filterPublic === opt.value
                                                ? "bg-terracotta text-white"
                                                : "text-text-muted hover:bg-cream"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button className="flex items-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark transition-colors ml-auto">
                            <Plus className="size-4" /> Tạo mới
                        </button>
                    </>
                )}
            </div>

            {/* Sub-tabs for own view */}
            {!isPublicView && (
                <div className="flex items-center gap-1.5 rounded-xl border border-beige bg-white p-1 w-fit">
                    {tabConfig.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setOwnTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    ownTab === tab.key
                                        ? "bg-terracotta text-white shadow-sm"
                                        : "text-text-muted hover:bg-cream"
                                }`}
                            >
                                <Icon className="size-3.5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-terracotta" /></div>
            ) : decks.length === 0 ? (
                (() => {
                    const key = isPublicView ? "public" : ownTab
                    const state = emptyStates[key]
                    return (
                        <EmptyState
                            icon={<state.icon className="size-10 text-terracotta" />}
                            title={state.title}
                            description={state.description}
                        />
                    )
                })()
            ) : isPublicView ? (
                /* ─── Public view (no actions) ─── */
                <div className="space-y-3">
                    <p className="text-xs font-bold text-text-muted">Bộ thẻ public ({decks.length})</p>
                    {decks.map((deck) => (
                        <div key={deck.id} className="rounded-[20px] border border-beige bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-text-primary">{deck.name}</h4>
                                    <p className="text-sm text-text-muted mt-1">
                                        {deck._count?.cards?.toLocaleString() ?? 0} thẻ
                                        {deck.description ? ` • ${deck.description}` : ""}
                                    </p>
                                    {deck.tags && deck.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {deck.tags.map((tag) => (
                                                <span key={tag} className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-text-muted">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-xs font-bold text-text-muted">
                                        <span className="flex items-center gap-1"><Download className="size-3.5" />{deck.downloadCount.toLocaleString()} lượt tải</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : ownTab === "own" ? (
                /* ─── Own decks ─── */
                grouped!.map(([parent, items]) => (
                    <section key={parent}>
                        <h3 className="text-lg font-black text-text-primary mb-3 flex items-center gap-2">
                            <Folder className="size-4 text-terracotta" fill="currentColor" />
                            {parent}
                            <span className="text-sm font-medium text-text-muted font-normal">({items.length} bộ)</span>
                        </h3>
                        <div className="space-y-3">
                            {items.map((deck) => <DeckCard2 key={deck.id} deck={deck} variant="own" />)}
                        </div>
                    </section>
                ))
            ) : (
                /* ─── Cloned / Archived ─── */
                <div className="space-y-3">
                    {decks.map((deck) => <DeckCard2 key={deck.id} deck={deck} variant={ownTab as "cloned" | "archived"} />)}
                </div>
            )}
        </div>
    )
}
