"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    LayoutDashboard,
    BookOpen,
    Users,
    BarChart3,
    Settings,
    ClipboardList,
    Languages,
    FileText,
    Flag,
    Star,
    Trophy,
    Bell,
    MessageSquareText,
    Brain,
} from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LogoutButton } from "../common/logout-button"

const items = [
    { title: "Overview", url: "/admin/overview", icon: LayoutDashboard },
    { title: "Users", url: "/admin/user", icon: Users },
    { title: "Languages", url: "/admin/language", icon: Languages },
    { title: "Templates", url: "/admin/template", icon: FileText },
    { title: "Achievements", url: "/admin/achievement", icon: Trophy },
    { title: "Decks", url: "/admin/deck", icon: BookOpen },
    { title: "Deck Reports", url: "/admin/deck-report", icon: Flag },
    { title: "Posts", url: "/admin/post", icon: ClipboardList },
    { title: "Suggestions", url: "/admin/suggestion", icon: MessageSquareText },
    { title: "Notifications", url: "/admin/notification", icon: Bell },
    { title: "Settings", url: "/admin/setting", icon: Settings },
]


function SidebarItem({
    item,
    collapsed,
    pathname,
}: {
    item: (typeof items)[number]
    collapsed: boolean
    pathname: string
}) {
    const active = pathname === item.url

    const button = (
        <Link
            href={item.url}
            className={cn(
                "flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all",
                collapsed && "justify-center px-0",
                active
                    ? "bg-white text-terracotta shadow-md"
                    : "text-white/80 hover:bg-white hover:text-black"
            )}
        >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
        </Link>
    )

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" align="center">
                    {item.title}
                </TooltipContent>
            </Tooltip>
        )
    }

    return button
}

export function AdminSidebar() {
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <aside
            className={cn(
                "flex h-full min-h-0 flex-col bg-terracotta py-8 transition-all duration-200 ease-linear",
                collapsed ? "w-[72px]" : "w-[180px]"
            )}
        >
            {/* Logo */}
            <div className="flex shrink-0 items-center justify-center pb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta text-white">
                    <Brain size={24} />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <h2 className="text-lg font-black tracking-tight text-white">
                            Recalio
                        </h2>

                        <p className="text-xs font-medium tracking-wide text-white/70">
                            Admin management
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3">
                {items.map((item) => (
                    <SidebarItem
                        key={item.title}
                        item={item}
                        collapsed={collapsed}
                        pathname={pathname}
                    />
                ))}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto flex shrink-0 flex-col gap-3 px-3">
                <LogoutButton collapsed={collapsed} />
            </div>
        </aside>
    )
}