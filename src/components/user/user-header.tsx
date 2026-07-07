"use client"

import { Bell, PanelLeft, PanelLeftClose } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserRole } from "@/constants/type"

const roleLabels: Record<string, string> = {
    [UserRole.ADMIN]: "Quản trị viên",
    [UserRole.MODERATOR]: "Kiểm duyệt viên",
    [UserRole.USER]: "Người dùng",
}

export function UserHeader() {
    const { state, toggleSidebar } = useSidebar()
    const user = useAuthStore((s) => s.user)
    const collapsed = state === "collapsed"
    const displayName = user?.displayName || user?.username || "User"
    const role = user?.role || UserRole.USER
    const avatarUrl = user?.avatarUrl
    const initials = displayName.charAt(0).toUpperCase()

    return (
        <header className="flex items-center justify-between shrink-0">
            <button
                onClick={toggleSidebar}
                className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-beige hover:text-text-primary"
            >
                {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>

            <div className="flex items-center gap-4 mr-5">
                <button className="relative h-10 w-10 flex items-center justify-center rounded-full border border-beige bg-white text-text-muted transition-all hover:border-terracotta hover:text-terracotta hover:shadow-sm">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 size-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                        <p className="text-xs text-text-muted">{roleLabels[role] || role}</p>
                    </div>
                    <Avatar className="size-9 rounded-xl">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={displayName} />
                        ) : (
                            <AvatarFallback className="rounded-xl bg-terracotta text-white text-sm font-semibold">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
