"use client"

import { Calendar, Clock, BookCheck, Eye, Loader2 } from "lucide-react"
import { UserAvatar } from "@/components/common/user-avatar"
import { Badge } from "@/components/ui/badge"
import { UserProfile, PublicProfile } from "@/schemas/user.schema"

const MOCK_LANGUAGES = ["English", "Japanese"]

interface ProfileViewProps {
    user: UserProfile | PublicProfile
    isOwn: boolean
    heroAction?: React.ReactNode
    tabs: React.ReactNode
}

export function ProfileView({ user: u, heroAction, tabs }: ProfileViewProps) {
    return (
        <div className="space-y-8 px-4 py-6 md:px-6">
            {/* Hero */}
            <section className="overflow-hidden rounded-[32px] border border-beige bg-white shadow-sm p-8">
                <div className="flex flex-col md:flex-row gap-6">
                    <UserAvatar avatarUrl={u.avatarUrl} fullName={u.displayName} username={u.username} className="size-[120px] border-4 border-beige shadow-md" />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-black text-text-primary tracking-tight">{u.displayName}</h1>
                                <p className="text-text-muted font-medium">@{u.username}</p>
                                {u.bio && <p className="mt-1 text-sm text-text-muted/80">{u.bio}</p>}
                            </div>
                            {heroAction && <div className="shrink-0">{heroAction}</div>}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {MOCK_LANGUAGES.map((lang) => (
                                <Badge key={lang} variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold text-text-muted border-beige">
                                    {lang === "English" ? "🇬🇧" : "🇯🇵"} {lang}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted/60 font-medium">
                            <Calendar className="size-3.5" />
                            Tham gia: {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-sm font-bold text-text-muted">
                            <span>{(u as any).followerCount ?? 0} người follow</span>
                            <span>•</span>
                            <span>đang follow {(u as any).followingCount ?? 0}</span>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatBadge icon={<BookCheck className="size-4" />} value={(u.stats?.totalCards ?? 0).toLocaleString()} label="Từ đã học" />
                    <StatBadge icon={<Calendar className="size-4" />} value={String(u.stats?.totalStudyDays ?? 0)} label="Ngày học" />
                    <StatBadge icon={<Eye className="size-4" />} value={(u.stats?.totalReviews ?? 0).toLocaleString()} label="Lượt review" />
                    <StatBadge icon={<Clock className="size-4" />} value={`${Math.round((u.stats?.totalStudyTimeMs ?? 0) / 3600000)} giờ`} label="Thời gian" />
                </div>
            </section>

            {/* Tabs */}
            {tabs}
        </div>
    )
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="rounded-xl bg-cream/70 p-3.5 border border-beige/40 hover:bg-cream transition-colors">
            <div className="mb-1 text-terracotta">{icon}</div>
            <p className="text-lg font-black text-text-primary">{value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
        </div>
    )
}
