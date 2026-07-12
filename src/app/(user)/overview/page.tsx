"use client"

import { ArrowRight, Flame, Zap, TrendingUp, Target, Brain, BookOpen, BarChart3, Play, Clock, AlertTriangle, Trophy, Medal, Loader2 } from "lucide-react"
import { StatCard } from "@/components/common/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/stores/useAuthStore"
import { useStudyStreak, useReviewStats, useXp, useDailyGoal, useStudyCalendar, useLeaderboard } from "@/queries/useGamificationQuery"
import { useFeaturedDecks } from "@/queries/useDeckQuery"
import { useCardStats, useDueCards } from "@/queries/useCardQuery"
import { useLatestReviews } from "@/queries/useReviewQuery"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DeckCard } from "@/components/common/deck-card"
import { ReviewCard } from "@/components/common/review-card"
import { StudyHeatmap } from "@/components/common/study-heatmap"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { useRouter } from "next/navigation"
import { getGreeting } from "@/utils/greeting"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

export default function UserOverviewPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const displayName = user?.displayName ?? "Nguyễn An"
    const greeting = getGreeting(new Date().getHours())
    const { data: streakRes } = useStudyStreak()
    const { data: reviewStatsRes } = useReviewStats()
    const { data: xpRes } = useXp()
    const { data: dailyGoalRes } = useDailyGoal()
    const { data: featuredRes } = useFeaturedDecks({ page: 1, limit: 4 })
    const { data: latestReviewsRes } = useLatestReviews()
    const latestReviews = ((latestReviewsRes as any)?.data ?? []) as any[]
    const { data: leaderboardRes, isLoading: leaderboardLoading } = useLeaderboard({ limit: 20 })
    const leaderboard = ((leaderboardRes as any)?.data ?? []) as any[]
    const { data: cardStatsRes } = useCardStats()
    const { data: dueCardsRes } = useDueCards({ limit: 10, page: 1 })
    const { data: calRes } = useStudyCalendar()
    const cardStats = (cardStatsRes as any)?.data as { new: number; learning: number; review: number; due: number; total: number } | undefined
    const dueCards = ((dueCardsRes as any)?.data ?? []) as any[]
    const calendar = (calRes as any)?.data as { date: string; count: number }[] | undefined
    const todayStr = new Date().toISOString().slice(0, 10)
    const todayReviews = calendar?.find((e) => e.date === todayStr)?.count ?? 0
    const totalStudied = calendar?.reduce((s, e) => s + e.count, 0) ?? 0
    const streak = (streakRes as any)?.data as { currentStreak: number; longestStreak: number } | undefined
    const currentStreak = streak?.currentStreak ?? 0
    const reviewStats = (reviewStatsRes as any)?.data as { retentionRate: number } | undefined
    const retentionRate = reviewStats?.retentionRate ?? 0
    const xp = (xpRes as any)?.data as { level: number; totalXP: number; progressPercent: number } | undefined
    const dailyGoal = (dailyGoalRes as any)?.data as { targetReviews: number; targetNewCards: number } | undefined
    const featuredDecks = ((featuredRes as any)?.data ?? []) as any[]

    return (
        <div className="">

            {/* HERO */}

            <section className="">
                <div className="relative overflow-hidden rounded-[32px] bg-beige p-8 lg:p-12">

                    <div className="max-w-2xl">

                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-text-primary">
                            <Flame size={16} />
                            AI-powered spaced repetition
                        </div>

                        <h1 className="mt-6 text-4xl font-bold leading-tight text-text-primary lg:text-6xl">
                            {greeting}, {displayName}
                        </h1>

                        <p className="mt-5 text-lg text-neutral-600">
                            🔥 {currentStreak} ngày streak — Đừng để mất chuỗi hôm nay!
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="rounded-full bg-terracotta px-8 py-4 font-medium text-white transition hover:bg-terracotta-dark">
                                Start Learning
                            </button>

                            <button className="rounded-full bg-white px-8 py-4 font-medium text-text-primary">
                                Browse Decks
                            </button>
                        </div>
                    </div>

                    {/* Decorative illustration */}

                    <div className="absolute right-10 top-10 hidden xl:block">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-32 w-32 rounded-[28px] bg-yellow-soft" />
                            <div className="h-32 w-32 rounded-[28px] bg-green-soft" />
                            <div className="h-32 w-32 rounded-[28px] bg-peach" />
                            <div className="h-32 w-32 rounded-[28px] bg-white" />
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 rounded-[24px] bg-terracotta px-6 py-4 text-white">
                        <h3 className="text-xl font-semibold">
                            Daily Review
                        </h3>

                        <p className="text-sm text-white/90">
                            120 cards waiting
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS */}

            <section className="px-6 py-10 lg:px-10">
                <div className="grid gap-5 md:grid-cols-4">

                    <StatCard
                        icon={<Zap size={24} />}
                        value={`Level ${xp?.level ?? 0}`}
                        label={`${xp?.totalXP ?? 0} XP`}
                    />

                    <StatCard
                        icon={<TrendingUp size={24} />}
                        value={`${(retentionRate * 100).toFixed(0)}%`}
                        label="Retention Rate"
                    />

                    <StatCard
                        icon={<Target size={24} />}
                        value={`${dailyGoal?.targetReviews ?? 0}`}
                        label="Mục tiêu / ngày"
                    />

                    <StatCard
                        icon={<Flame size={24} />}
                        value={`${currentStreak}`}
                        label="Ngày streak"
                    />
                </div>
            </section>

            {/* HEATMAP */}

            <section className="px-6 pb-10 lg:px-10">
                <StudyHeatmap />
            </section>

            {/* TODAY OVERVIEW */}

            <section className="px-6 pb-10 lg:px-10">
                <div className="mb-6">
                    <Title title="Tổng quan hôm nay" />
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100">
                                <BarChart3 className="size-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Đến hạn</p>
                                <p className="text-2xl font-black text-text-primary">{cardStats?.due ?? 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100">
                                <Clock className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Hôm nay</p>
                                <p className="text-2xl font-black text-text-primary">{todayReviews}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
                                <BookOpen className="size-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Tổng đã học</p>
                                <p className="text-2xl font-black text-text-primary">{totalStudied}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Brain className="size-5 text-terracotta" />
                        <h3 className="font-black text-text-primary">Thẻ đang học</h3>
                    </div>
                    {dueCards.length === 0 ? (
                        <EmptyState title="Không có thẻ nào đang học" description="Hãy thêm thẻ mới hoặc bắt đầu ôn tập" />
                    ) : (
                        <div className="divide-y divide-beige/60">
                            {dueCards.slice(0, 5).map((card: any) => (
                                <div key={card.id} className="flex items-center gap-3 py-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-peach/40 text-terracotta">
                                        <BookOpen className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-text-primary">
                                            {card.note?.word ?? "—"}
                                        </p>
                                        <p className="truncate text-xs text-text-muted">
                                            {card.note?.meaning ?? ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <button
                        onClick={() => router.push("/study")}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta px-6 py-4 font-black text-white shadow-sm transition hover:bg-terracotta-dark"
                    >
                        <Play className="size-5" />
                        Học ngay — {cardStats?.due ?? 0} thẻ
                    </button>
                </div>

                {/* FORECAST */}

                <div className="mt-8 rounded-2xl border border-beige bg-white p-5 shadow-sm">
                    <h3 className="flex items-center gap-2 text-base font-black text-text-primary mb-4">
                        <TrendingUp className="size-4 text-orange-500" /> Dự báo 30 ngày tới
                    </h3>
                    <div className="flex items-end gap-2 h-32">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const h = Math.floor(Math.random() * 50 + 5)
                            const chartColors = ["bg-[#FF8A65]", "bg-[#FFD54F]", "bg-[#81C784]"]
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className={`w-full rounded-t-sm ${h > 40 ? chartColors[0] : h > 25 ? chartColors[1] : chartColors[2]}`}
                                        style={{ height: `${h}%` }}
                                    />
                                    {(i + 1) % 5 === 0 && (
                                        <span className="text-[8px] font-bold text-text-muted">T{i + 16}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-text-muted bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
                        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                        Ngày 20/7 có 48 thẻ — nên học trước 1 ngày
                    </div>
                </div>
            </section>

            {/* POPULAR DECKS */}

            <section className="px-6 pb-10 lg:px-10">
                <div className="mb-6 flex items-center justify-between">

                    <Title title="Bộ thẻ nổi bật" />

                    <button onClick={() => router.push("/deck")} className="flex items-center gap-2 text-terracotta">
                        Xem tất cả
                        <ArrowRight size={18} />
                    </button>
                </div>

                {featuredDecks.length === 0 ? (
                    <EmptyState title="Chưa có bộ thẻ nổi bật." />
                ) : (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {featuredDecks.map((deck: any) => (
                            <SwiperSlide key={deck.id}>
                                <DeckCard deck={deck} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>

            {/* LATEST REVIEWS */}

            <section className="px-6 pb-10 lg:px-10">
                <div className="mb-6 flex items-center justify-between">
                    <Title title="Bài đánh giá mới nhất" />
                </div>

                {latestReviews.length === 0 ? (
                    <EmptyState title="Chưa có đánh giá nào." />
                ) : (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {latestReviews.map((review: any) => (
                            <SwiperSlide key={review.id}>
                                <ReviewCard review={review} router={router} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>

            {/* LEADERBOARD */}

            <section className="px-6 pb-10 lg:px-10">
                <div className="mb-6 flex items-center justify-between">
                    <Title title="Bảng xếp hạng" />
                    <button onClick={() => router.push("/leaderboard")} className="flex items-center gap-2 text-terracotta">
                        Xem tất cả
                        <ArrowRight size={18} />
                    </button>
                </div>

                {leaderboardLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-2xl border border-beige bg-white p-4 shadow-sm">
                                <Skeleton className="size-10 shrink-0 rounded-xl" />
                                <Skeleton className="size-10 shrink-0 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                    <EmptyState title="Chưa có dữ liệu xếp hạng." />
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry: any, idx: number) => {
                            const rank = entry.rank ?? idx + 1
                            const rankColors = ["bg-amber-400 text-white shadow-amber-200", "bg-gray-300 text-white shadow-gray-200", "bg-orange-300 text-white shadow-orange-200"]
                            const rankIcons = ["🥇", "🥈", "🥉"]
                            const isTop3 = idx < 3
                            return (
                                <div
                                    key={entry.user?.id ?? idx}
                                    className={`relative flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${isTop3 ? "border-amber-200/60" : "border-beige"}`}
                                >
                                    {isTop3 && (
                                        <div className="absolute -left-0.5 -top-0.5 z-10 flex size-7 items-center justify-center rounded-full text-sm shadow-sm bg-white">
                                            {rankIcons[idx]}
                                        </div>
                                    )}
                                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-sm ${isTop3 ? rankColors[idx] : "bg-gray-50 text-text-muted border border-beige"}`}>
                                        {isTop3 ? <Medal className="size-5" /> : rank}
                                    </div>
                                    <Avatar size="default">
                                        {entry.user?.avatarUrl ? (
                                            <AvatarImage src={entry.user.avatarUrl} alt={entry.user.displayName} />
                                        ) : null}
                                        <AvatarFallback className="bg-peach text-terracotta font-bold">
                                            {(entry.user?.displayName ?? "?").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-text-primary">
                                            {entry.user?.displayName ?? "Unknown"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600 border border-orange-200">
                                                Lv.{entry.level ?? 0}
                                            </span>
                                            <span className="text-xs text-text-muted">{entry.xp?.toLocaleString() ?? 0} XP</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 border border-amber-200/60">
                                        <Trophy className="size-4 text-amber-500" />
                                        <span className="font-black text-amber-700">{Number(entry.xp ?? 0) > 10000 ? "Cao thủ" : Number(entry.xp ?? 0) > 1000 ? "Chăm chỉ" : "Mới bắt đầu"}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>


        </div>
    )
}

// StatCard moved to @/components/common/stat-card

