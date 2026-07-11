"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Clock, Brain, Trophy, Loader2Icon, Eye, EyeOff } from "lucide-react"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { DataPagination } from "@/components/common/data-pagination"
import { useStudySession, useReviewLogs } from "@/queries/useStudySessionQuery"
import { useDeck } from "@/queries/useDeckQuery"
import { useCardsByDeck } from "@/queries/useCardQuery"
import { STATE_BADGE } from "@/utils/mapping"

import type { Card } from "@/schemas/card.schema"

const RATING_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    AGAIN: { label: "Again", color: "text-red-600", bg: "bg-red-50" },
    HARD: { label: "Hard", color: "text-orange-600", bg: "bg-orange-50" },
    GOOD: { label: "Good", color: "text-green-600", bg: "bg-green-50" },
    EASY: { label: "Easy", color: "text-blue-600", bg: "bg-blue-50" },
}

const STATE_LABELS: Record<string, string> = {
    NEW: "Mới",
    LEARNING: "Đang học",
    REVIEW: "Ôn tập",
    RELEARNING: "Học lại",
    SUSPENDED: "Tạm dừng",
}

function CardPreview({ card }: { card: any }) {
    const [flipped, setFlipped] = useState(false)
    return (
        <div className="rounded-2xl border border-beige bg-white overflow-hidden">
            <div className="p-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{flipped ? "Back" : "Front"}</span>
                <div className="mt-1 min-h-[60px]" dangerouslySetInnerHTML={{ __html: flipped ? card.backHtml : card.frontHtml }} />
                {card.css && <style>{card.css}</style>}
            </div>
            <button
                onClick={() => setFlipped(!flipped)}
                className="flex w-full items-center justify-center gap-1.5 border-t border-beige bg-cream/50 py-2 text-xs font-bold text-text-muted hover:bg-cream transition-colors"
            >
                {flipped ? <><EyeOff className="size-3.5" /> Front</> : <><Eye className="size-3.5" /> Back</>}
            </button>
        </div>
    )
}

export default function StudySessionDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [logPage, setLogPage] = useState(1)
    const LOG_LIMIT = 10

    const { data: sessionRes, isLoading: sessionLoading } = useStudySession(id)
    const { data: logsRes, isLoading: logsLoading } = useReviewLogs(id, { page: logPage, limit: LOG_LIMIT })

    const session = (sessionRes as any)?.data as {
        id: string; deckId: string | null; startedAt: string; endedAt: string | null
        stats?: { reviewedCards: number; timeSpentMs: number; again: number; hard: number; good: number; easy: number }
    } | undefined

    const { data: deckRes } = useDeck(session?.deckId ?? "")
    const deckName = ((deckRes as any)?.data as any)?.name ?? "Không xác định"

    const { data: allCardsRes } = useCardsByDeck(session?.deckId ?? "", { page: 1, limit: 500 })
    const allCards: Card[] = ((allCardsRes as any)?.data ?? []) as Card[]

    const logs = ((logsRes as any)?.data ?? []) as any[]
    const meta = (logsRes as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    const startedAt = session ? new Date(session.startedAt) : null
    const endedAt = session?.endedAt ? new Date(session.endedAt) : null
    const durationMs = endedAt && startedAt ? endedAt.getTime() - startedAt.getTime() : null
    const durationMin = durationMs ? Math.round(durationMs / 60000) : null
    const stats = session?.stats

    if (sessionLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2Icon className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!session) {
        return <EmptyState title="Không tìm thấy phiên học" description="Phiên học không tồn tại hoặc bạn không có quyền xem." />
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.push("/study")}
                className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
                <ArrowLeft className="size-4" />
                Quay lại
            </button>

            <Title
                title={`Phiên học: ${deckName}`}
                description={
                    startedAt
                        ? `${startedAt.toLocaleDateString("vi-VN")} — ${startedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                        : ""
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <Brain className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">{stats?.reviewedCards ?? 0}</p>
                            <p className="text-xs font-medium text-text-muted">thẻ đã ôn</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <Clock className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">
                                {durationMin !== null ? `${durationMin}p` : "—"}
                            </p>
                            <p className="text-xs font-medium text-text-muted">thời gian</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <Trophy className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">
                                {session.endedAt ? "Xong" : "Đang học"}
                            </p>
                            <p className="text-xs font-medium text-text-muted">trạng thái</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating distribution */}
            {stats && (
                <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-black text-text-primary tracking-tight">Phân bố đánh giá</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {(["AGAIN", "HARD", "GOOD", "EASY"] as const).map((r) => {
                            const count = stats[r.toLowerCase() as keyof typeof stats] as number
                            const total = stats.reviewedCards || 1
                            const pct = Math.round((count / total) * 100)
                            const info = RATING_LABELS[r]
                            return (
                                <div key={r} className={`rounded-xl ${info.bg} p-3 text-center`}>
                                    <p className={`text-lg font-black ${info.color}`}>{count}</p>
                                    <p className={`text-xs font-semibold ${info.color}`}>{info.label}</p>
                                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                                        <div
                                            className={`h-full rounded-full ${info.color.replace("text-", "bg-")}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Review logs — card preview + review info */}
            <div>
                <h3 className="mb-4 text-sm font-black text-text-primary tracking-tight">
                    Chi tiết ôn tập ({meta?.total ?? 0})
                </h3>

                {logsLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2Icon className="size-8 animate-spin text-terracotta" />
                    </div>
                ) : logs.length === 0 ? (
                    <EmptyState title="Chưa có dữ liệu" description="Chưa có thẻ nào được ôn trong phiên này." />
                ) : (
                    <div className="space-y-4">
                        {logs.map((log: any) => {
                            const ratingInfo = RATING_LABELS[log.rating] ?? { label: log.rating, color: "text-gray-600", bg: "bg-gray-50" }
                            return (
                                <div key={log.id} className="rounded-2xl border border-beige bg-white p-4 shadow-sm space-y-3">
                                    {/* Card preview */}
                                    {log.card && <CardPreview card={log.card} />}
                                    {/* Review info below card */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-text-muted">
                                        <span className={`inline-flex items-center gap-1 rounded-lg ${ratingInfo.bg} px-2.5 py-1 ${ratingInfo.color} font-bold`}>
                                            {ratingInfo.label}
                                        </span>
                                        <span>{log.responseTimeMs ? `${(log.responseTimeMs / 1000).toFixed(1)}s` : "—"}</span>
                                        <span>{STATE_LABELS[log.stateBefore] ?? log.stateBefore} → {STATE_LABELS[log.stateAfter] ?? log.stateAfter}</span>
                                    </div>
                                </div>
                            )
                        })}

                        {totalPages > 1 && (
                            <div className="pt-2">
                                <DataPagination page={logPage} totalPages={totalPages} onPageChange={setLogPage} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* All deck cards */}
            {session?.deckId && (
                <div>
                    <h3 className="mb-4 text-sm font-black text-text-primary tracking-tight">
                        Tất cả thẻ trong deck ({allCards.length})
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {allCards.map((card) => {
                            const badge = STATE_BADGE[card.state] ?? { label: card.state, className: "bg-gray-100 text-gray-500 border-gray-200" }
                            return (
                                <div key={card.id} className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm font-bold text-text-primary truncate">
                                            {card.note?.word || "—"}
                                        </p>
                                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <div className="text-xs text-text-muted line-clamp-2">
                                        {card.note?.meaning || "—"}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
