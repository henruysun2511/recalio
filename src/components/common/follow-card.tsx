"use client"

import { UserMinus, UserPlus } from "lucide-react"
import { UserAvatar } from "@/components/common/user-avatar"
import { FollowUser } from "@/schemas/follow.schema"

interface FollowCardProps {
    user: FollowUser
    onFollow?: (userId: string) => void
    onUnfollow?: (userId: string) => void
    pending?: boolean
}

export function FollowCard({ user, onFollow, onUnfollow, pending }: FollowCardProps) {
    const hasActions = onFollow || onUnfollow
    const isFollowing = user.isFollowing ?? false

    return (
        <div className="flex items-center gap-4 rounded-xl border border-beige bg-white p-4 hover:shadow-sm transition-shadow">
            <UserAvatar
                avatarUrl={user.avatarUrl}
                fullName={user.displayName}
                username={user.username}
                className="size-11 border border-beige"
            />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-text-primary text-sm">{user.displayName}</p>
                <p className="text-xs text-text-muted">@{user.username}</p>
            </div>
            {hasActions && isFollowing && (
                <button
                    onClick={() => onUnfollow?.(user.id)}
                    disabled={pending}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                    <UserMinus className="size-3.5" /> Bỏ follow
                </button>
            )}
            {hasActions && !isFollowing && (
                <button
                    onClick={() => onFollow?.(user.id)}
                    disabled={pending}
                    className="shrink-0 flex items-center gap-1.5 rounded-xl bg-terracotta px-3.5 py-2 text-xs font-bold text-white hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                >
                    <UserPlus className="size-3.5" /> Follow
                </button>
            )}
        </div>
    )
}
