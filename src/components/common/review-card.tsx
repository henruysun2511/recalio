"use client"

import { Star, MessageSquare } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getColor } from "@/utils/getColor"
import { timeAgo } from "@/utils/timeAgo"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface ReviewCardProps {
    review: {
        id: string
        rating: number
        comment?: string | null
        createdAt: string
        user?: {
            id: string
            username: string
            displayName: string
            avatarUrl?: string | null
        } | null
        deck: {
            id: string
            name: string
        }
    }
    router: AppRouterInstance
}

export function ReviewCard({ review, router }: ReviewCardProps) {
    return (
        <div
            onClick={() => router.push(`/deck/${review.deck.id}`)}
            className="group relative cursor-pointer rounded-[28px] border border-beige bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-md"
        >
            <div className="mb-3 flex items-center gap-2">
                <div
                    className={`flex size-10 items-center justify-center rounded-xl ${getColor(review.deck.id)}`}
                >
                    <MessageSquare className="size-5 text-white" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-text-primary">
                        {review.deck.name}
                    </h4>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {review.comment && (
                <p className="line-clamp-3 text-sm leading-relaxed text-text-muted">
                    &ldquo;{review.comment}&rdquo;
                </p>
            )}

            {review.user && (
                <div className="mt-4 flex items-center gap-2 border-t border-beige/60 pt-3">
                    <Avatar size="sm">
                        {review.user.avatarUrl ? (
                            <AvatarImage src={review.user.avatarUrl} alt={review.user.displayName || review.user.username} />
                        ) : null}
                        <AvatarFallback>
                            {(review.user.displayName || review.user.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-text-muted">
                        {review.user.displayName || review.user.username}
                    </span>
                    <span className="ml-auto text-[11px] text-text-muted/60">
                        {timeAgo(review.createdAt, "vi")}
                    </span>
                </div>
            )}
        </div>
    )
}
