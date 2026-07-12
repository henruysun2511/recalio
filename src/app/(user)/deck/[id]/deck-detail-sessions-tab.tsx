"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Clock, Brain, Trophy, ArrowRight, Loader2Icon } from "lucide-react"
import { useStudySessions } from "@/queries/useStudySessionQuery"
import { DataPagination } from "@/components/common/data-pagination"
import { EmptyState } from "@/components/common/empty-state"

interface SessionsTabProps {
    deckId: string
}

export function SessionsTab({ deckId }: SessionsTabProps) {
    const router = useRouter()
    const [page, setPage] = React.useState(1)
    const limit = 20

    const { data: res, isLoading } = useStudySessions({ deckId, page, limit })
    const sessions = ((res as any)?.data ?? []) as any[]
    const meta = (res as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    return (
        <div className="space-y-5">
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2Icon className="size-8 animate-spin text-terracotta" />
                </div>
            ) : sessions.length === 0 ? (
                <EmptyState title="Chưa có phiên học nào" description="Bộ thẻ này chưa có phiên ôn tập nào." />
            ) : (
                <div className="space-y-3">
                    {sessions.map((s: any) => {
                        const startedAt = new Date(s.startedAt)
                        const durationMs = s.endedAt ? new Date(s.endedAt).getTime() - startedAt.getTime() : null
                        const durationMin = durationMs ? Math.round(durationMs / 60000) : null
                        const stats = s.stats as any
                        return (
                            <div
                                key={s.id}
                                className="flex items-center gap-4 rounded-2xl border border-beige bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                onClick={() => router.push(`/study/session/${s.id}`)}
                            >
                                <div className="flex items-center justify-center size-12 rounded-xl bg-terracotta/10 shrink-0">
                                    <Brain className="size-6 text-terracotta" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-text-primary">
                                        {startedAt.toLocaleDateString("vi-VN")} — {startedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                                        <span className="flex items-center gap-1">
                                            <Brain className="size-3.5" /> {stats?.reviewedCards ?? 0} thẻ
                                        </span>
                                        {durationMin !== null && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="size-3.5" /> {durationMin}p
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Trophy className="size-3.5" /> {s.endedAt ? "Xong" : "Đang học"}
                                        </span>
                                    </div>
                                </div>
                                <ArrowRight className="size-5 text-text-muted shrink-0" />
                            </div>
                        )
                    })}
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
