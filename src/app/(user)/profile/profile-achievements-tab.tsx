"use client"

import { Trophy, Flame, Star, BookOpen, Moon, Sun, Target, Zap, Brain, Sparkles, Loader2 } from "lucide-react"
import { useXp, useAchievements } from "@/queries/useGamificationQuery"

const ICON_MAP: Record<string, typeof Trophy> = {
    FIRST_DECK: BookOpen,
    STREAK_7: Flame,
    STREAK_30: Flame,
    STREAK_100: Flame,
    REVIEWS_100: Star,
    REVIEWS_500: Star,
    REVIEWS_1000: Star,
    REVIEWS_5000: Star,
    PERFECT_WEEK: Trophy,
    NIGHT_OWL: Moon,
    EARLY_BIRD: Sun,
    DAILY_GOAL_7: Target,
    DAILY_GOAL_30: Target,
    SPEED_DEMON: Zap,
    MASTER: Brain,
    COLLECTOR: Sparkles,
}

function getIcon(key: string, fallback: typeof Trophy = Trophy) {
    return ICON_MAP[key] ?? fallback
}

const levelColors = [
    "bg-gray-200 text-gray-600",
    "bg-blue-50 text-blue-600",
    "bg-green-50 text-green-600",
    "bg-amber-50 text-amber-600",
    "bg-orange-50 text-orange-600",
    "bg-red-50 text-red-600",
    "bg-purple-50 text-purple-600",
    "bg-indigo-50 text-indigo-600",
    "bg-pink-50 text-pink-600",
    "bg-teal-50 text-teal-600",
]

export function ProfileAchievementsTab({ userId }: { userId?: string }) {
    const { data: xpRes, isLoading: xpLoading } = useXp(userId)
    const { data: achRes, isLoading: achLoading } = useAchievements(userId)
    const xp = xpRes?.data
    const achievements = achRes?.data
    const isOwn = !userId

    if (xpLoading || achLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-terracotta" /></div>
    }

    const unlocked = achievements?.unlocked ?? []
    const locked = achievements?.locked ?? []

    return (
        <div className="space-y-8">
            {/* Level & XP */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-2xl font-black text-text-primary mb-2">
                    <Trophy className="size-6 text-amber-500" /> Level {xp?.level ?? 0}
                </h3>
                {xp && (
                    <>
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden max-w-md">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                                style={{ width: `${xp.progressPercent}%` }}
                            />
                        </div>
                        <p className="text-sm font-bold text-text-muted mt-1">
                            {xp.currentLevelXP}/{xp.nextLevelXP} XP → Level {xp.level + 1}
                        </p>
                        <p className="text-xs font-medium text-text-muted mt-1">Tổng: {xp.totalXP.toLocaleString()} XP</p>
                    </>
                )}
            </section>

            {/* Unlocked */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-1">
                    🏅 Thành tích ({unlocked.length}/{unlocked.length + locked.length})
                </h3>
                <p className="text-xs font-medium text-text-muted mb-4">Đã mở khóa</p>
                {unlocked.length === 0 ? (
                    <p className="text-sm text-text-muted">Chưa có thành tích nào</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {unlocked.map((ach) => {
                            const Icon = getIcon(ach.key)
                            const color = levelColors[ach.xpReward % levelColors.length]
                            return (
                                <div key={ach.key} className="rounded-xl border border-beige bg-cream/50 p-4 hover:shadow-sm transition-shadow">
                                    <div className={`size-10 rounded-xl ${color} flex items-center justify-center mb-2`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <p className="text-sm font-bold text-text-primary">{ach.name}</p>
                                    <p className="text-[11px] text-text-muted">{ach.description}</p>
                                    <p className="text-[10px] font-bold text-terracotta mt-1">+{ach.xpReward} XP</p>
                                </div>
                            )
                        })}
                    </div>
                )}

                {isOwn && locked.length > 0 && (
                    <>
                        <h3 className="text-lg font-black text-text-primary mt-8 mb-4">Chưa mở khóa</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {locked.map((ach) => {
                                const Icon = getIcon(ach.key)
                                const pct = ach.progress ? Math.round((ach.progress.current / ach.progress.target) * 100) : 0
                                return (
                                    <div key={ach.key} className="rounded-xl border border-beige bg-white p-4 opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="size-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mb-2">
                                            <Icon className="size-5" />
                                        </div>
                                        <p className="text-sm font-bold text-text-primary">{ach.name}</p>
                                        <p className="text-[10px] text-text-muted">{ach.progress?.current ?? 0}/{ach.progress?.target ?? 0}</p>
                                        <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-gray-400" style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-[10px] font-bold text-terracotta mt-1">+{ach.xpReward} XP</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}