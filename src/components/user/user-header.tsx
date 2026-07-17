"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PanelLeft, Search } from "lucide-react"
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
    const { toggleSidebar } = useSidebar()
    const user = useAuthStore((s) => s.user)
    const displayName = user?.displayName || user?.username || "User"
    const role = user?.role || UserRole.USER
    const router = useRouter()
    const [searchValue, setSearchValue] = useState("")

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = searchValue.trim()
        if (!trimmed) return
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
        setSearchValue("")
    }, [searchValue, router])

    return (
        <header className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-beige hover:text-text-primary"
                >
                    <PanelLeft size={18} />
                </button>

                <form onSubmit={handleSearch} className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="h-9 w-48 rounded-xl border border-beige bg-white pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:w-64 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10"
                    />
                </form>
            </div>

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
