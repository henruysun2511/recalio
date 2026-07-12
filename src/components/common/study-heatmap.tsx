"use client"

import { useMemo } from "react"
import { Flame, Loader2 } from "lucide-react"
import { useStudyCalendar } from "@/queries/useGamificationQuery"

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const MONTH_LABELS = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]

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

interface StudyHeatmapProps {
    userId?: string
}

export function StudyHeatmap({ userId }: StudyHeatmapProps) {
    const { data: calendarRes, isLoading: calendarLoading } = useStudyCalendar(userId)
    const calendar = calendarRes?.data as { date: string; count: number }[] | undefined

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

    return (
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
    )
}
