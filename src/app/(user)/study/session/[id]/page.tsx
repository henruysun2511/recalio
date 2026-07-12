"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Clock, Brain, Trophy, Loader2Icon } from "lucide-react"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { DataPagination } from "@/components/common/data-pagination"
import { useStudySession, useReviewLogs } from "@/queries/useStudySessionQuery"
import { useDeck } from "@/queries/useDeckQuery"
import { RATING_LABELS, STATE_LABELS } from "@/utils/mapping"

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
                    <div className="space-y-2">
                        {logs.map((log: any) => {
                            const ratingInfo = RATING_LABELS[log.rating] ?? { label: log.rating, color: "text-gray-600", bg: "bg-gray-50" }
                            const templateType = log.card?.note?.template?.type
                            const word = templateType === "CLOZE"
                                ? (log.card?.note?.fields as any)?.Text || "Cloze"
                                : templateType === "IMAGE_OCCLUSION"
                                    ? `Occlusion #${(log.card?.variantIndex ?? 0) + 1}`
                                    : log.card?.note?.word || log.card?.frontHtml?.replace(/<[^>]+>/g, "")?.trim() || "—"
                            const meaning = templateType === "CLOZE"
                                ? (log.card?.note?.fields as any)?.Extra || "—"
                                : templateType === "IMAGE_OCCLUSION"
                                    ? (log.card?.note?.occlusionMasks as any[])?.map((m: any) => m.label).filter(Boolean).join(", ") || "—"
                                    : log.card?.note?.meaning || "—"
                            return (
                                <div key={log.id} className="flex items-center gap-3 rounded-xl border border-beige bg-white px-4 py-3 shadow-sm">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-text-primary truncate">{word}</p>
                                        <p className="text-xs text-text-muted truncate">{meaning}</p>
                                    </div>
                                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${ratingInfo.color} ${ratingInfo.bg}`}>
                                        {ratingInfo.label}
                                    </span>
                                    <span className="shrink-0 text-xs text-text-muted">
                                        {log.responseTimeMs ? `${(log.responseTimeMs / 1000).toFixed(1)}s` : "—"}
                                    </span>
                                    <span className="shrink-0 text-xs text-text-muted">
                                        {STATE_LABELS[log.stateBefore] ?? log.stateBefore} → {STATE_LABELS[log.stateAfter] ?? log.stateAfter}
                                    </span>
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

        </div>
    )
}
