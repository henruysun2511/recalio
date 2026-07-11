"use client"

import { useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const DEFAULT_AVATARS = [
    "https://i.pinimg.com/1200x/2d/9c/9b/2d9c9b4e2af4001298149a6384c2f8df.jpg",
    "https://i.pinimg.com/1200x/a4/8b/0f/a48b0f570ac862ff8b6b08181c73da3d.jpg",
    "https://i.pinimg.com/1200x/12/87/04/1287049f6970ae94903c28df1bbb6e0a.jpg",
    "https://i.pinimg.com/1200x/1f/7e/d9/1f7ed96ba2c35103904dd15e9f291707.jpg",
    "https://i.pinimg.com/1200x/60/33/23/603323075ee7f7c1b7c4a1f600ea4b2d.jpg",
    "https://i.pinimg.com/1200x/d4/38/f9/d438f9b7519cd1c68fe47da9f6fb8eca.jpg",
    "https://i.pinimg.com/1200x/14/74/e0/1474e01c5f79b9c99fe38251b6171050.jpg",
]

function getRandomAvatar(seed?: string): string {
    const s = seed || Math.random().toString()
    let hash = 0
    for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i)
        hash |= 0
    }
    return DEFAULT_AVATARS[Math.abs(hash) % DEFAULT_AVATARS.length]
}

interface UserAvatarProps {
    avatarUrl?: string | null
    fullName?: string | null
    username?: string
    className?: string
}

export function UserAvatar({ avatarUrl, fullName, username, className }: UserAvatarProps) {
    const src = useMemo(() => avatarUrl || getRandomAvatar(username), [avatarUrl, username])

    const getFallbackText = () => {
        const name = fullName || username
        if (!name) return "??"
        const words = name.trim().split(/\s+/)
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
        return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }

    return (
        <Avatar className={cn("size-10 border border-gray-100 shadow-sm shrink-0", className)}>
            <AvatarImage
                src={src}
                alt={fullName || username || "User avatar"}
                className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase select-none">
                {getFallbackText()}
            </AvatarFallback>
        </Avatar>
    )
}
