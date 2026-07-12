"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, EyeIcon, EyeOffIcon, Pencil } from "lucide-react"
import { useCardsByDeck } from "@/queries/useCardQuery"
import { DataPagination } from "@/components/common/data-pagination"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import { CardFilter } from "./card/card-filter"
import { STATE_BADGE } from "@/utils/mapping"
import { CardState } from "@/constants/type"
import { ImageOcclusionCardView } from "@/app/(user)/deck/[id]/create-notes/image-occlusion-card-view"
import type { Card } from "@/schemas/card.schema"

interface CardsTabProps {
    deckId: string
}

export function CardsTab({ deckId }: CardsTabProps) {
    const router = useRouter()
    const [page, setPage] = React.useState(1)
    const [state, setState] = React.useState("")
    const [search, setSearch] = React.useState("")
    const limit = 20

    const params = React.useMemo(
        () => ({ page, limit, ...(state ? { state: state as CardState } : {}) }),
        [page, state],
    )

    const { data: res, isLoading } = useCardsByDeck(deckId, params)
    const cards: Card[] = (res as any)?.data ?? []
    const meta = (res as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    const filteredCards = React.useMemo(() => {
        if (!search.trim()) return cards
        const q = search.toLowerCase()
        return cards.filter((c) => {
            if (c.note?.word?.toLowerCase().includes(q)) return true
            if (c.note?.meaning?.toLowerCase().includes(q)) return true
            if (c.occlusion?.masks?.some((m) => m.label?.toLowerCase().includes(q))) return true
            return false
        })
    }, [cards, search])

    const handleStateChange = (value: string) => {
        setState(value)
        setPage(1)
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <CardFilter
                    state={state}
                    search={search}
                    onStateChange={handleStateChange}
                    onSearchChange={setSearch}
                />
                <Button
                    onClick={() => router.push(`/deck/${deckId}/edit-cards`)}
                    className="shrink-0 rounded-xl gap-2"
                >
                    <Pencil className="size-4" />
                    Sửa thẻ
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2Icon className="size-8 animate-spin text-terracotta" />
                </div>
            ) : filteredCards.length === 0 ? (
                <EmptyState
                    title="Chưa có thẻ nào"
                    description={search ? "Không tìm thấy thẻ phù hợp." : state ? "Không tìm thấy thẻ phù hợp." : "Bộ thẻ này chưa có thẻ nào."}
                />
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filteredCards.map((card) => (
                            <CardItem key={card.id} card={card} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pt-2">
                            <DataPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function CardItem({ card }: { card: Card }) {
    const [flipped, setFlipped] = React.useState(false)
    const badge = STATE_BADGE[card.state] ?? { label: card.state, className: "bg-gray-100 text-gray-500 border-gray-200" }
    const isOcclusion = !!card.occlusion

    return (
        <div className="group relative rounded-[28px] border border-beige bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="absolute right-4 top-4 flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}>
                    {badge.label}
                </span>
            </div>

            <div className="mt-6">
                {isOcclusion && card.occlusion ? (
                    <ImageOcclusionCardView
                        imageUrl={card.occlusion.imageUrl}
                        masks={card.occlusion.masks}
                        variantIndex={card.variantIndex ?? 0}
                        showBack={flipped}
                        compact
                    />
                ) : (
                    <div className={`min-h-[80px] flex items-center justify-center ${flipped ? "" : ""}`}>
                        <style>{`
                            .cloze { font-weight: 800; color: #92400e; background: rgba(251,191,36,0.15); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(251,191,36,0.3); }
                            .cloze-reveal { font-weight: 800; color: #166534; background: rgba(34,197,94,0.12); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(34,197,94,0.3); }
                        `}</style>
                        <div
                            className="prose prose-sm max-w-none text-center"
                            dangerouslySetInnerHTML={{ __html: flipped ? card.backHtml : card.frontHtml }}
                        />
                    </div>
                )}
            </div>

            {card.css && (
                <style>{card.css}</style>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-beige/60 pt-3">
                <button
                    onClick={() => setFlipped(!flipped)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-text-muted transition-all hover:bg-beige/40 hover:text-text-primary active:scale-95"
                >
                    {flipped ? (
                        <>
                            <EyeOffIcon className="size-3.5" />
                            Mặt trước
                        </>
                    ) : (
                        <>
                            <EyeIcon className="size-3.5" />
                            Mặt sau
                        </>
                    )}
                </button>

                <span className="text-[10px] font-medium text-text-muted/60">
                    {new Date(card.due).toLocaleDateString("vi-VN")}
                </span>
            </div>
        </div>
    )
}
