"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Brain, Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { LogoutButton } from "../common/logout-button"

const items = [
    { title: "Trang chủ", url: "/overview", icon: Home },
    { title: "Danh sách Deck", url: "/deck", icon: BookOpen },
    { title: "Học tập", url: "/study", icon: Brain },
    { title: "Tiến trình", url: "/progress", icon: Trophy },
    { title: "Cộng đồng", url: "/community", icon: Users },
]

interface UserSidebarProps {
    collapsed: boolean
}

export function UserSidebar({ collapsed }: UserSidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "flex h-full min-h-0 flex-col bg-terracotta py-8 transition-all duration-200 ease-linear",
                collapsed ? "w-[72px] items-center" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className={cn("flex shrink-0 items-center gap-3 pb-8", collapsed ? "flex-col" : "px-6")}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta text-white">
                    <Brain size={24} />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <h2 className="text-lg font-black tracking-tight text-white">
                            Recalio
                        </h2>

                        <p className="text-xs font-medium tracking-wide text-white/70">
                            Master knowledge faster
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={cn("flex min-h-0 flex-1 flex-col gap-2", collapsed ? "items-center px-2" : "px-3")}>
                {items.map((item) => {
                    const active = pathname === item.url
                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                                collapsed && "justify-center px-0",
                                active
                                    ? "bg-white text-terracotta shadow-md"
                                    : "text-white/80 hover:bg-white/20 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className={cn("mt-auto flex shrink-0 flex-col gap-3", collapsed ? "items-center px-2" : "px-4")}>
                {!collapsed && (
                    <div className="rounded-2xl bg-white p-4 w-full">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-terracotta" />
                            <div>
                                <h4 className="font-medium text-text-primary text-sm">User</h4>
                                <p className="text-xs text-text-muted">🔥 24 Day Streak</p>
                            </div>
                        </div>
                    </div>
                )}
                <LogoutButton collapsed={collapsed} />
            </div>
        </aside>
    )
}
