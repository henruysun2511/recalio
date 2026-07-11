"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { Brain, BookOpen, BarChart3, Clock, Play, Flame, Plus, Target, FilePlus, History } from "lucide-react"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { DeckSkeleton } from "@/components/common/skeleton/deck-skeleton"
import { useMyDecks, useCreateDeck } from "@/queries/useDeckQuery"
import { useCardStats } from "@/queries/useCardQuery"
import { useXp, useDailyGoal, useStudyCalendar } from "@/queries/useGamificationQuery"
import { useStudySessions } from "@/queries/useStudySessionQuery"
import { DeckDialog } from "../deck/deck-dialog"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"
import cardService from "@/services/card.service"
import { CARD_QUERY_KEY } from "@/queries/useCardQuery"
import type { CreateDeckInput } from "@/schemas/deck.schema"

export default function StudyPage() {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)
    const createMutation = useCreateDeck()
    const { data: decksRes, isLoading: decksLoading } = useMyDecks({ page: 1, limit: 100 })
    const { data: statsRes } = useCardStats()
    const { data: xpRes } = useXp()
    const { data: goalRes } = useDailyGoal()

    const handleCreateSubmit = async (formData: CreateDeckInput) => {
        try {
            await createMutation.mutateAsync(formData, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Tạo bộ thẻ thành công")
                    setDialogOpen(false)
                },
                onError: (error: any) => {
                    handleError(error, "Tạo bộ thẻ thất bại")
                },
            })
        } catch (error) {
            console.error("Create deck failed", error)
        }
    }

    const now = new Date()
    const { data: calRes } = useStudyCalendar(undefined, { year: now.getFullYear(), month: now.getMonth() + 1 })
    const { data: sessionsRes } = useStudySessions({ page: 1, limit: 10 })

    const decks = ((decksRes as any)?.data || []) as any[]
    const deckMap = new Map(decks.map((d: any) => [d.id, d.name]))
    const stats = (statsRes as any)?.data as { new: number; learning: number; review: number; due: number; total: number } | undefined
    const xp = (xpRes as any)?.data as { currentStreak?: number; longestStreak?: number } | undefined
    const goal = (goalRes as any)?.data as { targetReviews?: number; targetNewCards?: number } | undefined
    const calendar = (calRes as any)?.data as { date: string; count: number }[] | undefined
    const sessions = ((sessionsRes as any)?.data ?? []) as any[]

    const todayStr = now.toISOString().slice(0, 10)
    const todayReviews = calendar?.find((e) => e.date === todayStr)?.count ?? 0

    const totalDue = (stats?.due ?? 0) + (stats?.learning ?? 0)
    const totalNew = stats?.new ?? 0
    const totalReview = stats?.review ?? 0
    const totalCards = stats?.total ?? 0

    const streak = xp?.currentStreak ?? 0
    const target = goal?.targetReviews ?? 0
    const goalProgress = target > 0 ? Math.min(todayReviews / target, 1) : 0

    const totalDueDecks = decks.filter((d: any) => d._count?.cards > 0 && d._count?.cards !== undefined).length

    // Per-deck stats queries
    const deckStatsQueries = useQueries({
        queries: decks.map((deck: any) => ({
            queryKey: [...CARD_QUERY_KEY, "stats", deck.id],
            queryFn: async () => {
                const res = await cardService.getStats(deck.id)
                return res.data
            },
            enabled: decks.length > 0,
        })),
    })

    const firstDeckWithDue = decks.find((_: any, i: number) => {
        const d = (deckStatsQueries[i]?.data as any)?.data
        return d && ((d.due ?? 0) + (d.learning ?? 0)) > 0
    })

    return (
        <div className="space-y-6">
            <Title title="Học tập" description="Ôn tập và ghi nhớ kiến thức mỗi ngày" />

            {/* Streak + Goal bar */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-beige bg-white px-5 py-3 text-sm shadow-sm">
                {streak > 0 && (
                    <span className="flex items-center gap-1.5 font-medium">
                        <Flame className="size-4 text-orange-500" />
                        Streak <span className="font-black text-text-primary">{streak}</span> ngày
                    </span>
                )}
                {target > 0 && (
                    <span className="flex items-center gap-1.5 font-medium">
                        <Target className="size-4 text-terracotta" />
                        Mục tiêu:{" "}
                        <span className="font-black text-text-primary">{todayReviews}</span>
                        <span className="text-text-muted">/</span>
                        <span className="font-medium text-text-primary">{target}</span>
                        <span className="ml-1 inline-flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-3 w-2 rounded-sm ${i < Math.round(goalProgress * 10) ? "bg-terracotta" : "bg-beige"}`}
                                />
                            ))}
                        </span>
                    </span>
                )}
                <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="size-4 text-blue-500" />
                    Hôm nay
                </span>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <BarChart3 className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">{totalDue}</p>
                            <p className="text-xs font-medium text-text-muted">thẻ đến hạn</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <Brain className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">{totalNew}</p>
                            <p className="text-xs font-medium text-text-muted">chưa học</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <BookOpen className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">{totalReview}</p>
                            <p className="text-xs font-medium text-text-muted">thẻ đã thuộc</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-terracotta/10">
                            <Brain className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-text-primary">{totalCards}</p>
                            <p className="text-xs font-medium text-text-muted">tổng thẻ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Học tất cả */}
            {totalDue > 0 && (
                <button
                    onClick={() => {
                        if (firstDeckWithDue) router.push(`/study/${firstDeckWithDue.id}`)
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-terracotta/40 bg-terracotta/5 px-6 py-3 text-sm font-semibold text-terracotta transition-all hover:bg-terracotta/10 hover:border-terracotta/60"
                >
                    <Play className="size-5 fill-terracotta" />
                    Học tất cả — {totalDue} thẻ
                </button>
            )}

            {/* Deck list header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">Bộ thẻ của bạn</h2>
                <button
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terracotta-dark"
                >
                    <Plus className="size-4" />
                    Tạo bộ thẻ
                </button>
            </div>

            {/* Deck list */}
            {decksLoading ? (
                <DeckSkeleton />
            ) : decks.length === 0 ? (
                <EmptyState
                    title="Bạn chưa có bộ thẻ nào"
                    description="Tạo bộ thẻ đầu tiên để bắt đầu học nhé."
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {decks.map((deck: any, i: number) => {
                        const ds = (deckStatsQueries[i]?.data as any)?.data as {
                            new: number; learning: number; review: number; due: number; total: number
                        } | undefined
                        const dueCount = (ds?.due ?? 0) + (ds?.learning ?? 0)
                        const totalDeckCards = deck._count?.cards ?? ds?.total ?? 0
                        const progress = totalDeckCards > 0
                            ? Math.round(((totalDeckCards - (ds?.new ?? totalDeckCards)) / totalDeckCards) * 100)
                            : 0

                        const isDeckEmpty = totalDeckCards === 0
                        const status = isDeckEmpty
                            ? { label: "Trống", border: "border-l-gray-300", dot: "bg-gray-300" }
                            : dueCount > 0
                                ? { label: "Cần học", border: "border-l-orange-500", dot: "bg-orange-500" }
                                : { label: "Hoàn thành", border: "border-l-green-500", dot: "bg-green-500" }

                        return (
                            <div
                                key={deck.id}
                                className={`relative rounded-2xl border border-beige bg-white p-5 shadow-sm transition-all hover:shadow-md ${status.border} border-l-4`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate text-base font-bold text-text-primary">
                                                {deck.name}
                                            </h3>
                                            <span className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${isDeckEmpty ? "bg-gray-100 text-gray-500" : dueCount > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                                                <span className={`size-1.5 rounded-full ${status.dot}`} />
                                                {status.label}
                                            </span>
                                        </div>
                                        {deck.description && (
                                            <p className="mt-0.5 line-clamp-2 text-sm text-text-muted">
                                                {deck.description}
                                            </p>
                                        )}
                                    </div>
                                    {deck.isPublic && (
                                        <span className="ml-2 shrink-0 rounded-lg border border-beige bg-cream px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                            Công khai
                                        </span>
                                    )}
                                </div>

                                {/* Progress bar */}
                                {!isDeckEmpty && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-text-muted">
                                                {progress}% &bull; {totalDeckCards} thẻ
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-beige">
                                            <div
                                                className="h-full rounded-full bg-terracotta transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* State breakdown */}
                                {ds && !isDeckEmpty && (
                                    <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                                        <span className="flex items-center gap-1">
                                            <span className="size-2 rounded-full bg-red-400" />
                                            {ds.due} đến hạn
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="size-2 rounded-full bg-yellow-400" />
                                            {ds.learning} đang học
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="size-2 rounded-full bg-green-400" />
                                            {ds.review} đã thuộc
                                        </span>
                                    </div>
                                )}

                                {/* Empty state message */}
                                {isDeckEmpty && (
                                    <p className="mt-3 text-xs font-medium text-text-muted">
                                        Deck chưa có thẻ nào. Hãy thêm thẻ để bắt đầu học.
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="mt-4 flex items-center gap-2">
                                    {isDeckEmpty ? (
                                        <button
                                            onClick={() => toast.info("Deck chưa có thẻ nào. Vui lòng thêm thẻ trước khi học.")}
                                            className="flex items-center gap-1.5 rounded-xl border border-beige bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed"
                                        >
                                            <Play className="size-3.5" />
                                            Bắt đầu
                                        </button>
                                    ) : dueCount > 0 ? (
                                        <button
                                            onClick={() => router.push(`/study/${deck.id}`)}
                                            className="flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-terracotta-dark"
                                        >
                                            <Play className="size-3.5 fill-white" />
                                            Học {dueCount} thẻ
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push(`/study/${deck.id}`)}
                                            className="flex items-center gap-1.5 rounded-xl border border-beige bg-white px-4 py-2 text-xs font-semibold text-text-primary transition-all hover:bg-cream"
                                        >
                                            <Play className="size-3.5" />
                                            Học
                                        </button>
                                    )}
                                    <button
                                        onClick={() => router.push(`/deck/${deck.id}/create-notes`)}
                                        className="flex items-center gap-1.5 rounded-xl border border-beige bg-white px-3 py-2 text-xs font-medium text-text-muted transition-all hover:bg-cream hover:text-text-primary"
                                    >
                                        <FilePlus className="size-3.5" />
                                        Thêm từ
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <DeckDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleCreateSubmit as any}
                loading={createMutation.isPending}
            />

            {/* Recent study sessions */}
            {sessions.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                            <History className="size-5 text-text-muted" />
                            Lịch sử học
                        </h2>
                    </div>
                    <div className="space-y-2">
                        {sessions.slice(0, 5).map((s: any) => {
                            const deckName = s.deckId ? deckMap.get(s.deckId) : null
                            const started = new Date(s.startedAt)
                            const duration = s.endedAt
                                ? Math.round((new Date(s.endedAt).getTime() - started.getTime()) / 60000)
                                : null
                            const isOngoing = !s.endedAt

                            return (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-4 rounded-xl border border-beige bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md cursor-pointer"
                                    onClick={() => router.push(`/study/session/${s.id}`)}
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream">
                                        <BookOpen className="size-4 text-text-muted" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-text-primary">
                                            {deckName || "Không xác định"}
                                        </p>
                                        <p className="text-xs font-medium text-text-muted">
                                            {started.toLocaleDateString("vi-VN")} &bull;{" "}
                                            {started.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                            {isOngoing && <span className="ml-2 text-green-600">đang học</span>}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right text-xs font-medium text-text-muted">
                                        {isOngoing ? (
                                            <span className="text-green-600">Đang học</span>
                                        ) : (
                                            <span>{duration} phút</span>
                                        )}
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
