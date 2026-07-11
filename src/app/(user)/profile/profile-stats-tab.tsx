"use client"

import { useMemo } from "react"
import { Flame, Trophy, AlertTriangle, Loader2, TrendingUp, Target, BarChart3, Clock, Sparkles } from "lucide-react"
import { useStudyCalendar, useStudyStreak, useReviewStats } from "@/queries/useGamificationQuery"
import { useCardStats } from "@/queries/useCardQuery"


const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const MONTH_LABELS = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]

const chartColors = [
    "bg-[#FF8A65]",
    "bg-[#FFD54F]",
    "bg-[#64B5F6]",
    "bg-[#81C784]",
    "bg-[#CE93D8]",
    "bg-[#F48FB1]",
]

const pieColors: Record<string, string> = {
    new: chartColors[3],
    learning: chartColors[1],
    review: chartColors[2],
    suspended: chartColors[4],
}

function heatmapLevel(count: number): string {
    if (count === 0) return "bg-gray-100"
    if (count <= 10) return "bg-[#FFE0B2]"
    if (count <= 30) return "bg-[#FFB74D]"
    return "bg-[#FF7043]"
}

function getMonday(d: Date): Date {
    const date = new Date(d)
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
}

function formatDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function ProfileStatsTab({ userId }: { userId?: string }) {
    const { data: streakRes, isLoading: streakLoading } = useStudyStreak(userId)
    const { data: calendarRes, isLoading: calendarLoading } = useStudyCalendar(userId)
    const { data: cardStatsRes, isLoading: cardLoading } = useCardStats(userId)
    const { data: reviewStatsRes, isLoading: reviewLoading } = useReviewStats(userId)
    const calendar = calendarRes?.data
    const streak = streakRes?.data
    const cardStats = cardStatsRes?.data
    const reviewStats = reviewStatsRes?.data

    const heatmapData = useMemo(() => {
        if (!calendar) return null
        const map = new Map<string, number>()
        calendar.forEach((e) => map.set(e.date, e.count))

        const today = new Date()
        const monday = getMonday(today)
        const weeks: { date: string; count: number }[][] = []
        let currentWeek: { date: string; count: number }[] = []

        for (let i = 0; i < 365; i++) {
            const d = new Date(monday)
            d.setDate(d.getDate() - i)
            const key = formatDateKey(d)
            currentWeek.push({ date: key, count: map.get(key) ?? 0 })
            if (currentWeek.length === 7) {
                weeks.unshift(currentWeek.reverse() as any)
                currentWeek = []
            }
        }
        if (currentWeek.length) weeks.unshift(currentWeek)

        while (weeks.length < 53) weeks.unshift([])
        return weeks
    }, [calendar])

    const totalStudyDays = useMemo(() => {
        if (!calendar) return 0
        return calendar.filter((e) => e.count > 0).length
    }, [calendar])

    const last30Days = useMemo(() => {
        if (!calendar) return []
        const today = new Date()
        const result: { date: string; count: number }[] = []
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const key = formatDateKey(d)
            const entry = calendar.find((e) => e.date === key)
            result.push({ date: key, count: entry?.count ?? 0 })
        }
        return result
    }, [calendar])

    const maxCount = useMemo(() => {
        if (last30Days.length === 0) return 1
        return Math.max(...last30Days.map((d) => d.count), 1)
    }, [last30Days])

    const cardDist = useMemo(() => {
        if (!cardStats || cardStats.total === 0) return null
        const items = [
            { key: "new", label: "New", value: cardStats.new },
            { key: "learning", label: "Learning", value: cardStats.learning },
            { key: "review", label: "Review", value: cardStats.review },
            { key: "suspended", label: "Suspended", value: cardStats.suspended },
        ]
        const total = items.reduce((s, i) => s + i.value, 0) || 1
        const withPct = items.map((i) => ({ ...i, pct: Math.round((i.value / total) * 1000) / 10 }))
        let offset = 0
        const circles = withPct.map((i, idx) => {
            const pct = i.pct
            const seg = pct > 0 ? Math.max(pct, 0.5) : 0
            const dashLen = (seg / 100) * 100
            const circle = {
                key: i.key,
                label: i.label,
                value: i.value,
                pct,
                color: pieColors[i.key],
                dashArray: `${dashLen}, 100`,
                dashOffset: -offset,
            }
            offset += dashLen
            return circle
        })
        return { items: withPct, circles, total }
    }, [cardStats])

    const rt = reviewStats?.avgResponseTime
    const responseTimeItems = useMemo(() => {
        if (!rt) return null
        const maxVal = Math.max(rt.again, rt.hard, rt.good, rt.easy, 1)
        return [
            { label: "Again", value: rt.again, pct: (rt.again / maxVal) * 100, color: chartColors[0] },
            { label: "Hard", value: rt.hard, pct: (rt.hard / maxVal) * 100, color: chartColors[1] },
            { label: "Good", value: rt.good, pct: (rt.good / maxVal) * 100, color: chartColors[3] },
            { label: "Easy", value: rt.easy, pct: (rt.easy / maxVal) * 100, color: chartColors[2] },
        ]
    }, [rt])

    return (
        <div className="space-y-8">
            {/* Streak */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                    <Flame className="size-5 text-orange-500" /> Streak
                </h3>
                {streakLoading ? (
                    <Loader2 className="size-5 animate-spin text-text-muted" />
                ) : (
                    <div className="flex gap-6 mb-4">
                        <div className="rounded-xl bg-orange-50 px-4 py-3 border border-orange-200">
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Hiện tại</p>
                            <p className="text-2xl font-black text-orange-600">
                                {streak?.currentStreak ?? 0} ngày <Flame className="size-5 inline" />
                            </p>
                        </div>
                        <div className="rounded-xl bg-amber-50 px-4 py-3 border border-amber-200">
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kỷ lục</p>
                            <p className="text-2xl font-black text-amber-600">
                                {streak?.longestStreak ?? 0} ngày <Trophy className="size-5 inline" />
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Heatmap */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                    <Flame className="size-5 text-orange-500" /> Heatmap (12 tháng qua)
                </h3>
                {calendarLoading ? (
                    <Loader2 className="size-5 animate-spin text-text-muted" />
                ) : heatmapData ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="w-6" />
                                    {MONTH_LABELS.map((m) => (
                                        <th key={m} className="text-[10px] font-bold text-text-muted text-left px-1 pb-1">{m}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {WEEK_LABELS.map((dayLabel, di) => (
                                    <tr key={dayLabel}>
                                        <td className="text-[10px] font-bold text-text-muted pr-2">{dayLabel}</td>
                                        {heatmapData.map((week, wi) => {
                                            const cell = week[di]
                                            return (
                                                <td key={`${wi}-${di}`} className="p-0.5">
                                                    {cell && (
                                                        <div
                                                            className={`h-3.5 w-full rounded-sm ${heatmapLevel(cell.count)}`}
                                                            title={`${cell.date}: ${cell.count} lượt`}
                                                        />
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
                <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-text-muted">
                    <span>▒ 0</span>
                    <div className="h-3 w-3 rounded-sm bg-[#FFE0B2]" />
                    <span>1-10</span>
                    <div className="h-3 w-3 rounded-sm bg-[#FFB74D]" />
                    <span>11-30</span>
                    <div className="h-3 w-3 rounded-sm bg-[#FF7043]" />
                    <span>31+</span>
                    <span className="ml-auto font-bold">{totalStudyDays} ngày học</span>
                </div>
            </section>

            {/* Study progress chart (last 30 days) */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                    <TrendingUp className="size-5 text-orange-500" /> Tiến độ học (30 ngày qua)
                </h3>
                <div className="flex items-end gap-2 h-40">
                    {last30Days.map((d) => {
                        const pct = (d.count / maxCount) * 100 || 2
                        return (
                            <div key={d.date} className="flex-1 flex flex-col justify-end gap-0.5 group relative">
                                <div
                                    className={`w-full rounded-t-sm transition-all ${d.count > 0 ? chartColors[2] : chartColors[5]}`}
                                    style={{ height: `${pct}%` }}
                                />
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-text-muted bg-white px-1.5 py-0.5 rounded shadow whitespace-nowrap transition-opacity">
                                    {d.date.slice(5)}: {d.count}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs font-bold text-text-muted">
                    <span className="flex items-center gap-1.5"><span className={`size-3 rounded-sm ${chartColors[2]}`} /> Review</span>
                </div>
            </section>

            {/* Card distribution + Retention */}
            <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                        <Target className="size-5 text-orange-500" /> Phân bố thẻ
                    </h3>
                    {cardLoading ? (
                        <Loader2 className="size-5 animate-spin text-text-muted" />
                    ) : cardDist ? (
                        <div className="flex items-center gap-6">
                            <div className="relative size-32">
                                <svg viewBox="0 0 36 36" className="size-32 -rotate-90">
                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                                    {cardDist.circles.map((c) => (
                                        <circle
                                            key={c.key}
                                            cx="18" cy="18" r="15.9"
                                            fill="none"
                                            style={{ stroke: c.color }}
                                            strokeWidth="3"
                                            strokeDasharray={c.dashArray}
                                            strokeDashoffset={c.dashOffset}
                                        />
                                    ))}
                                </svg>
                            </div>
                            <div className="space-y-1.5 text-sm font-medium text-text-muted">
                                {cardDist.items.map((i) => (
                                    <p key={i.key}>
                                        <span className={`inline-block size-2.5 rounded-full ${pieColors[i.key]} mr-2`} />
                                        {i.label} <strong className="text-text-primary">{i.pct}%</strong>
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted">Chưa có thẻ nào</p>
                    )}
                </section>

                <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                        <BarChart3 className="size-5 text-orange-500" /> Tỷ lệ nhớ
                    </h3>
                    {reviewLoading ? (
                        <Loader2 className="size-5 animate-spin text-text-muted" />
                    ) : reviewStats ? (
                        <>
                            <p className="text-4xl font-black text-text-primary">
                                {Math.round(reviewStats.retentionRate * 100)}%
                            </p>
                            <div className="mt-4 h-3 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${chartColors[3]}`}
                                    style={{ width: `${reviewStats.retentionRate * 100}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-text-muted">Chưa có dữ liệu</p>
                    )}
                </section>
            </div>

            {/* Response time */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                    <Clock className="size-5 text-orange-500" /> Thời gian phản hồi trung bình
                </h3>
                {reviewLoading ? (
                    <Loader2 className="size-5 animate-spin text-text-muted" />
                ) : responseTimeItems ? (
                    <div className="space-y-3">
                        {responseTimeItems.map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <span className="w-14 text-sm font-bold text-text-muted">{item.label}</span>
                                <div className="flex-1 h-5 rounded-lg bg-gray-100 overflow-hidden">
                                    <div className={`h-full rounded-lg ${item.color}`} style={{ width: `${item.pct}%` }} />
                                </div>
                                <span className="w-14 text-sm font-bold text-text-primary text-right">{item.value.toFixed(1)}s</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-muted">Chưa có dữ liệu</p>
                )}
            </section>

            {/* Forecast — giữ mock vì chưa có API */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                    <Sparkles className="size-5 text-orange-500" /> Dự báo 30 ngày tới
                </h3>
                <div className="flex items-end gap-2 h-32">
                    {Array.from({ length: 30 }).map((_, i) => {
                        const h = Math.floor(Math.random() * 50 + 5)
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className={`w-full rounded-t-sm ${h > 40 ? chartColors[0] : h > 25 ? chartColors[1] : chartColors[3]}`}
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
            </section>
        </div>
    )
}