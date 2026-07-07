"use client"

import { Button } from "@/components/ui/button"
import { FolderPlus } from "lucide-react"
import { ReactNode } from "react"

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-beige bg-white py-20 px-6 text-center">
            {icon ?? (
                <div className="mb-6 flex size-20 items-center justify-center rounded-[24px] bg-peach">
                    <FolderPlus className="size-10 text-terracotta" />
                </div>
            )}

            <h3 className="text-2xl font-bold text-text-primary">{title}</h3>

            {description && (
                <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted">{description}</p>
            )}

            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-8 rounded-2xl">{actionLabel}</Button>
            )}
        </div>
    )
}
