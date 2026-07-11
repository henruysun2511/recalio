"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Bell,
    BellRing,
    ChevronDown,
    Check,
    Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { timeAgo } from "@/utils/timeAgo"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead } from "@/queries/useNotificationQuery"
import { TYPE_ICONS, TYPE_COLORS } from "@/utils/notification-mapping"
import type { Notification } from "@/schemas/notification.schema"

export function UserNotification() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [allNotifications, setAllNotifications] = useState<Notification[]>([])
    const pageRef = useRef(page)
    pageRef.current = page

    const { data: unreadData } = useUnreadCount()
    const { data: notifData, isLoading } = useNotifications({ page, limit: 10 } as any)
    const markRead = useMarkRead()
    const markAllRead = useMarkAllRead()

    const unreadCount = (unreadData as any)?.data?.unread ?? 0
    const total = (notifData as any)?.meta?.total ?? 0
    const hasMore = allNotifications.length < total

    useEffect(() => {
        if (!notifData) return
        const items = (notifData as any)?.data ?? []
        if (pageRef.current === 1) {
            setAllNotifications(items)
        } else {
            setAllNotifications((prev) => {
                const existingIds = new Set(prev.map((n) => n.id))
                const unique = items.filter((n: Notification) => !existingIds.has(n.id))
                return [...prev, ...unique]
            })
        }
    }, [notifData])

    const handleOpenChange = useCallback((val: boolean) => {
        setOpen(val)
        if (val) setPage(1)
    }, [])

    const handleMarkRead = useCallback((id: string) => {
        markRead.mutate(id)
    }, [markRead])

    const handleMarkAllRead = useCallback(() => {
        markAllRead.mutate()
    }, [markAllRead])

    const handleViewMore = useCallback(() => {
        setPage((p) => p + 1)
    }, [])

    const handleNotifClick = useCallback((n: Notification) => {
        if (!n.isRead) handleMarkRead(n.id)
        const url = (n.data as any)?.url as string | undefined
        if (url) router.push(url)
    }, [handleMarkRead, router])

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 flex items-center justify-center rounded-full border border-beige bg-white text-text-muted transition-all hover:border-terracotta hover:text-terracotta hover:shadow-sm data-[state=open]:border-terracotta data-[state=open]:text-terracotta">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 size-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-[380px] p-0 rounded-2xl border-beige shadow-xl bg-white overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-beige/50">
                    <h3 className="text-sm font-black text-text-primary tracking-tight">Thông báo</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={markAllRead.isPending}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terracotta hover:text-terracotta/70 transition-colors disabled:opacity-50"
                        >
                            {markAllRead.isPending ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                <Check className="size-3" />
                            )}
                            Đọc tất cả
                        </button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto">
                    {isLoading && page === 1 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="size-5 animate-spin text-text-muted" />
                        </div>
                    ) : allNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                            <BellRing className="size-8 mb-2 opacity-40" />
                            <p className="text-sm font-medium">Không có thông báo</p>
                        </div>
                    ) : (
                        allNotifications.map((n) => {
                            const Icon = TYPE_ICONS[n.type] ?? BellRing
                            const colorClass = TYPE_COLORS[n.type] ?? "text-gray-500 bg-gray-50"
                            return (
                                <button
                                    key={n.id}
                                    onClick={() => handleNotifClick(n)}
                                    className={cn(
                                        "w-full text-left px-5 py-3.5 flex gap-3 transition-colors hover:bg-cream/80 border-b border-beige/30 last:border-b-0",
                                        !n.isRead && "bg-peach/20"
                                    )}
                                >
                                    <div className={cn("mt-0.5 size-9 shrink-0 rounded-xl flex items-center justify-center", colorClass)}>
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={cn("text-sm leading-snug", !n.isRead ? "font-bold text-text-primary" : "font-medium text-text-muted")}>
                                                {n.title}
                                            </p>
                                            {!n.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-terracotta" />}
                                        </div>
                                        {n.body && (
                                            <p className="text-xs text-text-muted/70 mt-0.5 line-clamp-2">{n.body}</p>
                                        )}
                                        <p className="text-[10px] text-text-muted/50 mt-1 font-medium">
                                            {timeAgo(n.sentAt)}
                                        </p>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-beige/50 p-2">
                    {hasMore ? (
                        <button
                            onClick={handleViewMore}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-cream transition-colors disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <ChevronDown className="size-3.5" />
                            )}
                            Xem thêm
                        </button>
                    ) : allNotifications.length > 0 && (
                        <p className="text-center py-2 text-[10px] font-medium text-text-muted/50">
                            Đã hiển thị tất cả thông báo
                        </p>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
