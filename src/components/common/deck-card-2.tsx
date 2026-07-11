"use client"

import { useState } from "react"
import {
    Globe, Lock, Loader2, Copy, Archive,
    RotateCcw, Trash2, MoreVertical, Edit,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { useToggleArchive, useDeleteDeck, useUpdateDeck } from "@/queries/useDeckQuery"
import type { DeckResponse } from "@/schemas/deck.schema"

interface DeckCard2Props {
    deck: DeckResponse
    variant: "own" | "cloned" | "archived"
}

export function DeckCard2({ deck, variant }: DeckCard2Props) {
    const toggleArchive = useToggleArchive()
    const deleteDeck = useDeleteDeck()
    const updateDeck = useUpdateDeck()
    const [unarchiving, setUnarchiving] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editName, setEditName] = useState(deck.name)
    const [editDesc, setEditDesc] = useState(deck.description ?? "")

    const handleUnarchive = () => {
        setUnarchiving(true)
        toggleArchive.mutate(deck.id, { onSettled: () => setUnarchiving(false) })
    }

    const handleTogglePublic = () => {
        updateDeck.mutate({ id: deck.id, data: { isPublic: !deck.isPublic } })
    }

    const openEdit = () => {
        setEditName(deck.name)
        setEditDesc(deck.description ?? "")
        setEditing(true)
    }

    const handleSaveEdit = () => {
        updateDeck.mutate(
            { id: deck.id, data: { name: editName, description: editDesc || undefined } },
            { onSuccess: () => setEditing(false) },
        )
    }

    return (
        <>
            <div className="rounded-[20px] border border-beige bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-text-primary">{deck.name}</h4>
                            <Badge
                                variant="outline"
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                    deck.isPublic
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                            >
                                {deck.isPublic
                                    ? <><Globe className="size-3 mr-1" />Public</>
                                    : <><Lock className="size-3 mr-1" />Private</>
                                }
                            </Badge>
                            {variant === "archived" && (
                                <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-orange-200 bg-orange-50 text-orange-700">
                                    <Archive className="size-3 mr-1" />Đã lưu trữ
                                </Badge>
                            )}
                            {variant === "cloned" && (
                                <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-700">
                                    <Copy className="size-3 mr-1" />Đã clone
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-text-muted mt-1">
                            {deck._count?.cards?.toLocaleString() ?? 0} thẻ
                            {deck.description ? ` • ${deck.description}` : ""}
                        </p>
                        {deck.tags && deck.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {deck.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-bold text-text-muted">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {variant === "archived" ? (
                            <button
                                onClick={handleUnarchive}
                                disabled={unarchiving}
                                className="flex items-center gap-1.5 rounded-xl border border-beige px-3.5 py-2 text-xs font-bold text-terracotta hover:bg-cream transition-colors disabled:opacity-50"
                            >
                                {unarchiving ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <RotateCcw className="size-3.5" />
                                )}
                                Bỏ lưu trữ
                            </button>
                        ) : (
                            <>
                                <button className="flex items-center gap-1.5 rounded-xl border border-beige px-3.5 py-2 text-xs font-bold text-text-muted hover:bg-cream transition-colors">
                                    Ôn tập
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-beige p-0 text-text-muted hover:bg-cream">
                                            <MoreVertical className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-36">
                                        <DropdownMenuItem onClick={openEdit} className="flex items-center gap-2 text-sm">
                                            <Edit className="size-4" />
                                            Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleTogglePublic} className="flex items-center gap-2 text-sm">
                                            {deck.isPublic ? <Lock className="size-4" /> : <Globe className="size-4" />}
                                            {deck.isPublic ? "Chuyển private" : "Chuyển public"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleUnarchive} className="flex items-center gap-2 text-sm">
                                            <Archive className="size-4" />
                                            Lưu trữ
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => deleteDeck.mutate(deck.id)}
                                            className="flex items-center gap-2 text-sm text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="size-4" />
                                            Xoá
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editing} onOpenChange={setEditing}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa bộ thẻ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-bold text-text-muted mb-1.5 block">Tên bộ thẻ</label>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted mb-1.5 block">Mô tả</label>
                            <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                        <Button onClick={handleSaveEdit} disabled={!editName.trim() || updateDeck.isPending}>
                            {updateDeck.isPending ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
