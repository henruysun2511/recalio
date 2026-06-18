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
} from "lucide-react"

import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const items = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Decks", url: "/admin/decks", icon: BookOpen },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Reports", url: "/admin/reports", icon: ClipboardList },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
]

const bottomItems = [
    { title: "Settings", url: "/admin/settings", icon: Settings },
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
                    : "text-white/80 hover:bg-white/15 hover:text-white"
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
                {/* Bạn có thể đặt component Logo hoặc text ở đây */}
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
                {bottomItems.map((item) => (
                    <SidebarItem
                        key={item.title}
                        item={item}
                        collapsed={collapsed}
                        pathname={pathname}
                    />
                ))}
            </div>
        </aside>
    )
}