"use client"

import Link from "next/link"
import { Flag, Users, ClipboardList, ArrowRight, BarChart3 } from "lucide-react"
import { UserAvatar } from "@/components/common/user-avatar"
import { useDashboard } from "@/queries/useAdminQuery"
import { useMyProfile } from "@/queries/useUserQuery"

export function AdminSidebarRight() {
    const { data: profileRes } = useMyProfile()
    const { data: dashboardRes } = useDashboard()

    const profile = (profileRes as any)?.data
    const dashboard = (dashboardRes as any)?.data
    const pendingReports = dashboard?.recentReports ?? []

    return (
        <aside className="flex h-full min-h-0 w-full flex-col bg-white p-6 overflow-y-auto">
            {/* Profile */}
            <div className="flex items-center gap-4">
                <UserAvatar
                    avatarUrl={profile?.avatarUrl}
                    fullName={profile?.displayName}
                    username={profile?.username}
                    className="size-14 rounded-2xl"
                />
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-text-primary">
                        {profile?.displayName || "Admin"}
                    </h3>
                    <p className="text-sm text-neutral-400 capitalize">{profile?.role?.toLowerCase() || "admin"}</p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">{profile?.email}</p>
                    {profile?.bio && (
                        <p className="mt-1 text-xs text-text-muted line-clamp-2">{profile.bio}</p>
                    )}
                </div>
            </div>

            {/* Today's Summary */}
            <section className="mt-8">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-text-primary">
                    <BarChart3 className="size-4 text-terracotta" />
                    Hôm nay
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-near-white px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <Users className="size-4 text-blue-500" />
                            <span className="text-sm text-text-muted">User mới</span>
                        </div>
                        <span className="text-sm font-bold text-text-primary">{dashboard?.newUsersToday ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-near-white px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <ClipboardList className="size-4 text-terracotta" />
                            <span className="text-sm text-text-muted">Reviews</span>
                        </div>
                        <span className="text-sm font-bold text-text-primary">{dashboard?.reviewsToday ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-near-white px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <Flag className="size-4 text-red-500" />
                            <span className="text-sm text-text-muted">Reports chờ</span>
                        </div>
                        <span className="text-sm font-bold text-red-500">{dashboard?.pendingReports ?? 0}</span>
                    </div>
                </div>
            </section>

            {/* Pending Actions */}
            {pendingReports.length > 0 && (
                <section className="mt-8">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-text-primary">
                        <Flag className="size-4 text-red-500" />
                        Reports mới nhất
                    </h4>
                    <div className="space-y-2">
                        {pendingReports.slice(0, 3).map((r: any) => (
                            <div
                                key={r.id}
                                className="rounded-xl bg-near-white px-4 py-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate text-sm font-medium text-text-primary">
                                        {r.deck?.name}
                                    </span>
                                    <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                        {r.reason}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-text-muted">
                                    {r.reportedBy?.displayName || r.reportedBy?.username}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/admin/deck-report"
                        className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-terracotta/10 px-4 py-2.5 text-xs font-semibold text-terracotta transition hover:bg-terracotta/20"
                    >
                        Xem tất cả reports <ArrowRight className="size-3" />
                    </Link>
                </section>
            )}

        </aside>
    )
}
