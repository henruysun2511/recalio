"use client"

import { PanelLeft, PanelLeftClose } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { UserAvatar } from "@/components/common/user-avatar"
import { UserNotification } from "@/components/common/user-notification"
import { UserRole } from "@/constants/type"
import Link from "next/link"

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

    return (
        <header className="flex items-center justify-between shrink-0">
            <button
                onClick={toggleSidebar}
                className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-beige hover:text-text-primary"
            >
                {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>

            <div className="flex items-center gap-4 mr-5">
                <UserNotification />

                <Link href="/profile">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-text-primary">{displayName}</p>
                            <p className="text-xs text-text-muted">{roleLabels[role] || role}</p>
                        </div>
                        <UserAvatar
                            avatarUrl={user?.avatarUrl}
                            fullName={user?.displayName}
                            username={user?.username}
                            className="size-9 rounded-xl"
                        />
                    </div>
                </Link>
            </div>
        </header>
    )
}
