"use client"

import { Users, BookOpen, ClipboardList, Globe, Flag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { OverviewStatCard } from "./overview-stat-card";
import { OverviewChart } from "./overview-chart";
import { useDashboard } from "@/queries/useAdminQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/utils/timeAgo";

export default function AdminOverviewPage() {
    const { data, isLoading } = useDashboard();

    const dashboard = (data as any)?.data;

    const stats = [
        { icon: Users, label: "Users", value: dashboard?.totalUsers ?? 0, trend: `+${dashboard?.newUsersToday ?? 0} hôm nay`, trendUp: true },
        { icon: BookOpen, label: "Decks", value: dashboard?.totalDecks ?? 0 },
        { icon: ClipboardList, label: "Reviews", value: dashboard?.totalReviews ?? 0, trend: `+${dashboard?.reviewsToday ?? 0} hôm nay`, trendUp: true },
        { icon: Globe, label: "Public Decks", value: dashboard?.publicDecks ?? 0 },
        { icon: Flag, label: "Reports", value: dashboard?.pendingReports ?? 0, highlight: true, highlightLabel: "Cần xử lý" },
    ];

    const userGrowth = (dashboard?.userGrowth ?? []).map((d: { date: string; count: number }) => ({
        label: new Date(d.date).getDate().toString().padStart(2, "0"),
        value: d.count,
    }));

    const reviewCounts = (dashboard?.reviewCounts ?? []).map((d: { date: string; count: number }) => ({
        label: new Date(d.date).getDate().toString().padStart(2, "0"),
        value: d.count,
    }));

    const d = new Date();
    const today = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                        Admin
                    </p>
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                        Overview
                    </h1>
                </div>
                <span className="text-sm font-medium text-text-muted">Hôm nay: {today}</span>
            </div>

            {/* Stats */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-beige bg-white p-5 shadow-sm space-y-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-7 w-28" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((s) => (
                        <OverviewStatCard key={s.label} {...s} />
                    ))}
                </div>
            )}

            {/* Charts */}
            {isLoading ? (
                <div className="flex flex-col lg:flex-row gap-4">
                    <Skeleton className="h-52 flex-1 rounded-2xl" />
                    <Skeleton className="h-52 flex-1 rounded-2xl" />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                    <OverviewChart title="User tăng trưởng (30 ngày)" data={userGrowth} />
                    <OverviewChart
                        title="Reviews/ngày (30 ngày)"
                        data={reviewCounts}
                        formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                    />
                </div>
            )}

            {/* Deck Reports */}
            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-beige">
                    <div className="flex items-center gap-2">
                        <Flag className="size-4 text-red-500" />
                        <span className="text-sm font-bold text-text-primary">Deck Reports mới nhất</span>
                    </div>
                    <Link href="/admin/deck-report" className="flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline">
                        Xem tất cả <ArrowRight className="size-3" />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="p-5 space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-beige/60 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                    <th className="px-5 py-3">Deck</th>
                                    <th className="px-5 py-3">Lý do</th>
                                    <th className="px-5 py-3">Người báo</th>
                                    <th className="px-5 py-3">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dashboard?.recentReports ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-sm text-text-muted">
                                            Chưa có báo cáo nào
                                        </td>
                                    </tr>
                                ) : (
                                    dashboard?.recentReports.map((r: any) => (
                                        <tr key={r.id} className="border-b border-beige/30 last:border-0">
                                            <td className="px-5 py-3 font-semibold text-text-primary">{r.deck?.name}</td>
                                            <td className="px-5 py-3">
                                                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                                                    {r.reason}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-text-muted">
                                                {r.reportedBy?.displayName || r.reportedBy?.username}
                                            </td>
                                            <td className="px-5 py-3 text-text-muted">{timeAgo(r.createdAt)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* New Users */}
            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-beige">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-blue-500" />
                        <span className="text-sm font-bold text-text-primary">
                            User mới đăng ký hôm nay ({dashboard?.newUsersToday ?? 0})
                        </span>
                    </div>
                    <Link href="/admin/user" className="flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline">
                        Xem tất cả <ArrowRight className="size-3" />
                    </Link>
                </div>
                {isLoading ? (
                    <div className="p-5 space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-beige/60 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                    <th className="px-5 py-3">Tên</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(dashboard?.recentUsers ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-sm text-text-muted">
                                            Chưa có user mới
                                        </td>
                                    </tr>
                                ) : (
                                    dashboard?.recentUsers.map((u: any) => (
                                        <tr key={u.id} className="border-b border-beige/30 last:border-0">
                                            <td className="px-5 py-3 font-semibold text-text-primary">
                                                {u.displayName || u.username}
                                            </td>
                                            <td className="px-5 py-3 text-text-muted">{u.email}</td>
                                            <td className="px-5 py-3 text-text-muted">{timeAgo(u.createdAt)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
