"use client"

import { DeckResponse } from "@/schemas/deck.schema"
import {
    Download,
    Layers,
    MoreHorizontal,
    Folder,
    Globe,
    Lock,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DeckCardProps {
    deck: DeckResponse
    onEdit?: (deck: DeckResponse) => void
    onDelete?: (id: string) => void
    onArchive?: (id: string) => void
    onReport?: (id: string) => void
    onClone?: (id: string) => void
}

const pastelColors = [
    "bg-peach",
    "bg-yellow-soft",
    "bg-blue-soft",
    "bg-green-soft",
    "bg-purple-soft",
    "bg-pink-soft",
]

function getColor(id: string) {
    let hash = 0

    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }

    return pastelColors[Math.abs(hash) % pastelColors.length]
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()

    const days = Math.floor(diff / 86400000)

    if (days === 0) return "Today"
    if (days === 1) return "1 day ago"
    if (days < 7) return `${days} days ago`

    const weeks = Math.floor(days / 7)

    if (weeks < 4) return `${weeks} weeks ago`

    const months = Math.floor(days / 30)

    return `${months} months ago`
}

export function DeckCard({
    deck,
    onEdit,
    onDelete,
    onArchive,
    onReport,
    onClone,
}: DeckCardProps) {
    const visibilityStyle = deck.isPublic
        ? "bg-green-500 text-white"
        : "bg-primary text-white"

    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-beige
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-terracotta/30
                hover:shadow-md
            "
        >
            <div className="relative h-40 w-full overflow-hidden">
                {deck.coverImage ? (
                    <>
                        <img
                            src={deck.coverImage}
                            alt={deck.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                ) : (
                    <div
                        className={`
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-neutral-100
                            to-neutral-200/60
                            ${getColor(deck.id)}
                        `}
                    >
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/40 shadow-inner backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <Folder className="size-7 text-white" fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* Nút Public / Private - Nằm góc TRÊN BÊN TRÁI của Cover */}
                <span
                    className={`
                        absolute
                        left-3
                        top-3
                        z-10
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        px-1.5
                        py-0.5
                        text-[10px]
                        font-bold
                        leading-none
                        tracking-wide
                        shadow-sm
                        backdrop-blur-sm
                        ${visibilityStyle}
                    `}
                >
                    {deck.isPublic ? (
                        <Globe className="size-2.5" />
                    ) : (
                        <Lock className="size-2.5" />
                    )}
                    {deck.isPublic ? "Public" : "Private"}
                </span>

                {/* Nút 3 chấm Dropdown - Nằm góc TRÊN BÊN PHẢI của Cover */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="
                                    absolute
                                    right-3
                                    top-3
                                    z-10
                                    rounded-xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    text-black
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:bg-neutral-50
                                    opacity-70
                                    group-hover:opacity-100
                                    data-[state=open]:opacity-100
                                "
                        >
                            <MoreHorizontal className="size-3.5" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-28 rounded-xl">
                        {onEdit && <DropdownMenuItem onClick={() => onEdit(deck)}>Chỉnh sửa</DropdownMenuItem>}
                        {onArchive && <DropdownMenuItem onClick={() => onArchive(deck.id)}>Lưu trữ</DropdownMenuItem>}
                        {onClone && <DropdownMenuItem onClick={() => onClone(deck.id)}>Sao chép</DropdownMenuItem>}
                        {onReport && <DropdownMenuItem onClick={() => onReport(deck.id)} className="text-red-600 focus:bg-red-50 focus:text-red-600">Tố cáo</DropdownMenuItem>}
                        {onDelete && (
                            <DropdownMenuItem
                                onClick={() => onDelete(deck.id)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                                Xóa
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* -------------------- CONTENT AREA -------------------- */}
            <div className="p-5">
                {/* Thời gian + Tác giả */}
                <div className="mb-2 flex items-center justify-between">
                    {deck.user && (
                        <div className="flex items-center gap-1.5">
                            <User className="size-3 text-text-muted" />
                            <span className="text-xs text-text-muted font-medium">
                                {deck.user.displayName || deck.user.username}
                            </span>
                        </div>
                    )}
                    <span className="text-xs text-text-muted font-medium">
                        {timeAgo(deck.updatedAt || deck.createdAt)}
                    </span>
                </div>

                {/* Deck Title */}
                <h3
                    className="
                        line-clamp-1
                        text-lg
                        font-bold
                        tracking-tight
                        text-text-primary
                        transition-colors
                        group-hover:text-terracotta
                    "
                >
                    {deck.name}
                </h3>

                {/* Description */}
                {deck.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
                        {deck.description}
                    </p>
                )}

                {/* Tags */}
                <div className="mt-4 flex min-h-[26px] flex-wrap gap-1.5">
                    {deck.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="
                                rounded-lg
                                bg-peach/40
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                                text-terracotta
                            "
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Card Footer Info */}
                <div
                    className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        border-t
                        border-beige/60
                        pt-3.5
                    "
                >
                    <div className="flex items-center gap-1.5">
                        <Layers className="size-4 text-terracotta/80" />
                        <span className="text-sm font-bold text-text-primary">
                            {deck._count?.cards ?? 0}
                        </span>
                        <span className="text-xs text-text-muted">
                            cards
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-text-muted/80">
                        <Download className="size-3.5" />
                        <span>{deck.downloadCount ?? 0}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}