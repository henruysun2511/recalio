"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft, Folder, Loader2, EyeOff,
    Pencil, Trash2, Save, X, ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMyDecks } from "@/queries/useDeckQuery"
import { useCardsByDeck, useSuspendCard, useBuryCard } from "@/queries/useCardQuery"
import { useUpdateNote, useDeleteNote } from "@/queries/useNoteQuery"
import { CardFilter } from "../card/card-filter"
import { DataPagination } from "@/components/common/data-pagination"
import { EmptyState } from "@/components/common/empty-state"
import { CardPreview } from "@/components/common/card-preview"
import { ClozeEditor } from "../create-notes/cloze-editor"
import { ImageOcclusionEditor } from "../create-notes/image-occlusion-editor"
import { STATE_BADGE } from "@/utils/mapping"
import { CardState } from "@/constants/type"
import { PartOfSpeech } from "@/constants/type"
import { handleError } from "@/utils/handleError"
import type { Card } from "@/schemas/card.schema"

export default function EditCardsPage() {
    const { id: deckParam } = useParams<{ id: string }>()
    const router = useRouter()

    // Deck selection
    const [selectedDeckId, setSelectedDeckId] = React.useState(deckParam)
    const { data: decksRes } = useMyDecks({ page: 1, limit: 100 })
    const decks = ((decksRes as any)?.data ?? []) as { id: string; name: string; _count?: { cards: number } }[]

    // Card list
    const [page, setPage] = React.useState(1)
    const [stateFilter, setStateFilter] = React.useState("")
    const [search, setSearch] = React.useState("")
    const limit = 20

    const params = React.useMemo(
        () => ({ page, limit, ...(stateFilter ? { state: stateFilter as CardState } : {}) }),
        [page, stateFilter],
    )

    const { data: cardsRes, isLoading } = useCardsByDeck(selectedDeckId, params)
    const cards: Card[] = ((cardsRes as any)?.data ?? []) as Card[]
    const meta = (cardsRes as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    // Selected card & editing
    const [selectedCard, setSelectedCard] = React.useState<Card | null>(null)
    const [editing, setEditing] = React.useState(false)
    const [editForm, setEditForm] = React.useState<{
        word: string; meaning: string; ipa: string; example: string; partOfSpeech: string;
        text: string; extra: string; imageUrl: string | null;
        masks: { x: number; y: number; width: number; height: number; groupIndex: number; label?: string | null }[];
    }>({
        word: "", meaning: "", ipa: "", example: "", partOfSpeech: "",
        text: "", extra: "", imageUrl: null,
        masks: [],
    })

    // Mutations
    const updateNoteMutation = useUpdateNote()
    const deleteNoteMutation = useDeleteNote()
    const suspendMutation = useSuspendCard()
    const buryMutation = useBuryCard()

    // Filter search
    const filteredCards = React.useMemo(() => {
        if (!search.trim()) return cards
        const q = search.toLowerCase()
        return cards.filter((c) => {
            const text = c.templateType === 'CLOZE'
                ? ((c.note?.fields as any)?.Text ?? '')
                : (c.note?.word ?? '')
            return text.toLowerCase().includes(q)
        })
    }, [cards, search])

    // Select card
    React.useEffect(() => {
        if (filteredCards.length > 0 && !selectedCard) {
            setSelectedCard(filteredCards[0])
        }
    }, [filteredCards, selectedCard])

    React.useEffect(() => {
        if (selectedCard) {
            const fields = selectedCard.note?.fields ?? {}
            setEditForm({
                word: selectedCard.note?.word ?? "",
                meaning: selectedCard.note?.meaning ?? "",
                ipa: selectedCard.note?.ipa ?? "",
                example: selectedCard.note?.example ?? "",
                partOfSpeech: selectedCard.note?.partOfSpeech ?? "",
                text: (fields as any)?.Text ?? "",
                extra: (fields as any)?.Extra ?? "",
                imageUrl: selectedCard.note?.imageUrl ?? null,
                masks: selectedCard.occlusion?.masks?.map((m) => ({
                    x: m.x, y: m.y, width: m.width, height: m.height,
                    groupIndex: m.groupIndex, label: m.label,
                })) ?? [],
            })
        }
    }, [selectedCard])

    const handleSave = async () => {
        if (!selectedCard?.noteId) return
        try {
            const data: any = {}
            const templateType = selectedCard.templateType

            if (templateType === 'CLOZE') {
                const oldFields = (selectedCard.note?.fields ?? {}) as Record<string, any>
                if (editForm.text !== (oldFields.Text ?? "")) data.fields = { ...oldFields, Text: editForm.text }
                if (editForm.extra !== (oldFields.Extra ?? "")) {
                    data.fields = { ...(data.fields ?? oldFields), Extra: editForm.extra }
                }
            } else if (templateType === 'IMAGE_OCCLUSION') {
                if (editForm.imageUrl !== (selectedCard.note?.imageUrl ?? null)) data.imageUrl = editForm.imageUrl
                const oldMasks = selectedCard.occlusion?.masks ?? []
                const newMasks = editForm.masks
                const masksChanged = newMasks.length !== oldMasks.length || newMasks.some((m, i) =>
                    m.x !== oldMasks[i].x || m.y !== oldMasks[i].y ||
                    m.width !== oldMasks[i].width || m.height !== oldMasks[i].height ||
                    m.groupIndex !== oldMasks[i].groupIndex || m.label !== oldMasks[i].label
                )
                if (masksChanged) data.masks = newMasks.map(({ x, y, width, height, groupIndex, label }) => ({ x, y, width, height, groupIndex, label }))
            } else {
                if (editForm.word !== selectedCard.note?.word) data.word = editForm.word
                if (editForm.meaning !== selectedCard.note?.meaning) data.meaning = editForm.meaning
                if (editForm.ipa !== (selectedCard.note?.ipa ?? "")) data.ipa = editForm.ipa || undefined
                if (editForm.example !== (selectedCard.note?.example ?? "")) data.example = editForm.example || undefined
                if (editForm.partOfSpeech !== (selectedCard.note?.partOfSpeech ?? "")) {
                    data.partOfSpeech = (editForm.partOfSpeech as PartOfSpeech) || undefined
                }
            }
            if (Object.keys(data).length === 0) { toast.info("Không có thay đổi"); return }
            await updateNoteMutation.mutateAsync({ id: selectedCard.noteId, data })
            toast.success("Đã cập nhật ghi chú")
            setEditing(false)
            setSelectedCard(null)
        } catch (error) {
            handleError(error, "Cập nhật thất bại")
        }
    }

    return (
        <div className="flex flex-col min-h-[70vh] bg-peach-light border border-beige rounded-[32px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-beige shrink-0">
                <button
                    onClick={() => router.push(`/deck/${deckParam}`)}
                    className="size-10 rounded-xl border border-beige bg-white flex items-center justify-center hover:bg-cream transition-colors"
                >
                    <ArrowLeft className="size-5 text-text-primary" />
                </button>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-0.5">
                        {decks.find((d) => d.id === selectedDeckId)?.name ?? "Deck"}
                    </p>
                    <h1 className="text-2xl font-black text-text-primary tracking-tighter">
                        Edit Cards
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="grid grid-cols-[220px_1fr_380px] flex-1 overflow-hidden">
                {/* Left — Deck list */}
                <aside className="bg-cream p-4 border-r border-beige overflow-y-auto">
                    <div className="text-xs font-bold text-text-muted uppercase mb-4 px-2">My Decks</div>
                    {decks.map((deck) => (
                        <button
                            key={deck.id}
                            onClick={() => { setSelectedDeckId(deck.id); setSelectedCard(null); setPage(1) }}
                            className={`w-full text-left p-3 mb-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                                selectedDeckId === deck.id
                                    ? 'bg-white border border-terracotta shadow-sm'
                                    : 'hover:bg-peach-light border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Folder className="text-terracotta shrink-0" size={18} />
                                <span className="font-medium text-sm truncate">{deck.name}</span>
                            </div>
                            <span className="text-xs text-text-muted shrink-0 ml-2">{deck._count?.cards ?? 0}</span>
                        </button>
                    ))}
                </aside>

                {/* Center — Card list */}
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <CardFilter
                            state={stateFilter}
                            search={search}
                            onStateChange={(v) => { setStateFilter(v); setPage(1) }}
                            onSearchChange={setSearch}
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-terracotta" />
                        </div>
                    ) : filteredCards.length === 0 ? (
                        <EmptyState
                            title="Không có thẻ nào"
                            description={stateFilter ? "Không tìm thấy thẻ phù hợp." : "Deck này chưa có thẻ nào."}
                        />
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-beige overflow-hidden">
                                <div className="grid grid-cols-[1fr_100px_100px_120px] p-4 border-b border-beige text-sm font-semibold text-text-muted">
                                    <div>Word</div>
                                    <div>State</div>
                                    <div>Due</div>
                                    <div>Actions</div>
                                </div>
                                {filteredCards.map((card) => {
                                    const badge = STATE_BADGE[card.state] ?? { label: card.state, className: "bg-gray-100 text-gray-500 border-gray-200" }
                                    const isSelected = selectedCard?.id === card.id
                                    return (
                                        <div
                                            key={card.id}
                                            onClick={() => { setSelectedCard(card); setEditing(false) }}
                                            className={`grid grid-cols-[1fr_100px_100px_120px] p-4 border-b border-beige items-center cursor-pointer hover:bg-peach-light/50 transition-colors ${
                                                isSelected ? 'bg-terracotta/10 border-l-4 border-l-terracotta' : ''
                                            }`}
                                        >
                                            <div className="font-medium text-sm truncate text-text-primary">
                                                {card.templateType === 'IMAGE_OCCLUSION'
                                                    ? (card.note?.imageUrl ? <span className="flex items-center gap-1.5"><ImageIcon size={14} className="shrink-0" /> Image Occlusion</span> : "IO")
                                                    : card.templateType === 'CLOZE'
                                                        ? ((card.note?.fields as any)?.Text?.slice(0, 60) ?? "Cloze")
                                                        : (card.note?.word ?? "—")}
                                            </div>
                                            <div>
                                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                            <div className="text-sm text-text-muted">
                                                {new Date(card.due).toLocaleDateString("vi-VN")}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setEditing(true) }}
                                                    className="p-1.5 rounded-lg hover:bg-beige/40 text-text-muted hover:text-terracotta transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation()
                                                        try {
                                                            await suspendMutation.mutateAsync(card.id)
                                                            toast.success(badge.label === "Tạm ngưng" ? "Đã bỏ tạm ngưng" : "Đã tạm ngưng")
                                                        } catch (err) { handleError(err) }
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-beige/40 text-text-muted hover:text-amber-600 transition-colors"
                                                >
                                                    <EyeOff size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {totalPages > 1 && (
                                <DataPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                            )}
                        </div>
                    )}
                </div>

                {/* Right — Preview & Edit */}
                <aside className="bg-cream p-6 overflow-y-auto space-y-5">
                    {!selectedCard ? (
                        <div className="flex items-center justify-center h-full text-text-muted text-sm">
                            Chọn một thẻ để xem
                        </div>
                    ) : editing ? (
                        /* Edit Mode */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-text-muted uppercase">Chỉnh sửa — {selectedCard.templateType ?? 'BASIC'}</h3>
                                <button onClick={() => setEditing(false)} className="text-text-muted hover:text-text-primary">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(!selectedCard.templateType || selectedCard.templateType === 'BASIC') && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Word</label>
                                            <input
                                                value={editForm.word}
                                                onChange={(e) => setEditForm((f) => ({ ...f, word: e.target.value }))}
                                                className="w-full rounded-xl border border-beige bg-white px-3 py-2.5 text-sm font-semibold text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Meaning</label>
                                            <textarea
                                                value={editForm.meaning}
                                                onChange={(e) => setEditForm((f) => ({ ...f, meaning: e.target.value }))}
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-beige bg-white px-3 py-2.5 text-sm text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">IPA</label>
                                            <input
                                                value={editForm.ipa}
                                                onChange={(e) => setEditForm((f) => ({ ...f, ipa: e.target.value }))}
                                                className="w-full rounded-xl border border-beige bg-white px-3 py-2.5 text-sm text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Part of Speech</label>
                                            <Select
                                                value={editForm.partOfSpeech}
                                                onValueChange={(v) => setEditForm((f) => ({ ...f, partOfSpeech: v }))}
                                            >
                                                <SelectTrigger className="w-full rounded-xl border-beige bg-white">
                                                    <SelectValue placeholder="Chọn..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(PartOfSpeech).map((pos) => (
                                                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Example</label>
                                            <textarea
                                                value={editForm.example}
                                                onChange={(e) => setEditForm((f) => ({ ...f, example: e.target.value }))}
                                                rows={2}
                                                className="w-full resize-none rounded-xl border border-beige bg-white px-3 py-2.5 text-sm text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                                {selectedCard.templateType === 'CLOZE' && (
                                    <ClozeEditor
                                        text={editForm.text}
                                        extra={editForm.extra}
                                        onChange={(fields) => setEditForm((f) => ({ ...f, text: fields.Text, extra: fields.Extra }))}
                                    />
                                )}
                                {selectedCard.templateType === 'IMAGE_OCCLUSION' && (
                                    <ImageOcclusionEditor
                                        imageUrl={editForm.imageUrl}
                                        masks={editForm.masks}
                                        onChange={(data) => setEditForm((f) => ({ ...f, imageUrl: data.imageUrl, masks: data.masks }))}
                                    />
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={updateNoteMutation.isPending}
                                    className="flex-1 rounded-xl gap-2"
                                >
                                    {updateNoteMutation.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Save className="size-4" />
                                    )}
                                    Lưu
                                </Button>
                                <Button variant="outline" onClick={() => setEditing(false)} className="rounded-xl border-beige">
                                    <X className="size-4" /> Huỷ
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Preview Mode */
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-text-muted uppercase">Preview</h3>
                                <button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white transition-all hover:bg-terracotta-dark active:scale-95">
                                    <Pencil className="size-4" /> Sửa
                                </button>
                            </div>

                            {/* Flashcard */}
                            <CardPreview card={selectedCard} />

                            {/* Info */}
                            <div className="bg-white p-6 rounded-3xl border border-beige shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-muted">Type</span>
                                    <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cream text-text-muted">
                                        {selectedCard.templateType ?? 'BASIC'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-muted">State</span>
                                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATE_BADGE[selectedCard.state]?.className ?? "bg-gray-100 text-gray-500"}`}>
                                        {STATE_BADGE[selectedCard.state]?.label ?? selectedCard.state}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-muted">Due</span>
                                    <span className="text-sm font-semibold text-text-primary">
                                        {new Date(selectedCard.due).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                {selectedCard.templateType === 'BASIC' && selectedCard.note?.ipa && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-text-muted">IPA</span>
                                        <span className="text-sm font-semibold text-text-primary">/{selectedCard.note.ipa}/</span>
                                    </div>
                                )}
                                {selectedCard.templateType === 'BASIC' && selectedCard.note?.partOfSpeech && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-text-muted">POS</span>
                                        <span className="text-sm font-semibold text-text-primary">{selectedCard.note.partOfSpeech}</span>
                                    </div>
                                )}
                            </div>

                            {/* Meaning & Example (BASIC only) */}
                            {selectedCard.templateType === 'BASIC' && (
                                <div className="bg-white p-6 rounded-3xl border border-beige shadow-sm space-y-3">
                                    {selectedCard.note?.meaning && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Meaning</p>
                                            <p className="text-sm text-text-primary leading-relaxed">{selectedCard.note.meaning}</p>
                                        </div>
                                    )}
                                    {selectedCard.note?.example && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Example</p>
                                            <p className="text-sm text-text-primary italic leading-relaxed">"{selectedCard.note.example}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* CLOZE fields preview */}
                            {selectedCard.templateType === 'CLOZE' && (() => {
                                const fields = (selectedCard.note?.fields ?? {}) as Record<string, any>
                                return (
                                    <div className="bg-white p-6 rounded-3xl border border-beige shadow-sm space-y-3">
                                        {fields.Text && (
                                            <div>
                                                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Text</p>
                                                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{fields.Text}</p>
                                            </div>
                                        )}
                                        {fields.Extra && (
                                            <div>
                                                <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Extra</p>
                                                <p className="text-sm text-text-primary italic leading-relaxed">{fields.Extra}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}
                            {/* IMAGE_OCCLUSION preview */}
                            {selectedCard.templateType === 'IMAGE_OCCLUSION' && (
                                <div className="bg-white p-6 rounded-3xl border border-beige shadow-sm space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Image</p>
                                        {selectedCard.note?.imageUrl ? (
                                            <img src={selectedCard.note.imageUrl} alt="" className="w-full rounded-xl border border-beige" />
                                        ) : <p className="text-sm text-text-muted">No image</p>}
                                    </div>
                                    {selectedCard.occlusion?.masks && selectedCard.occlusion.masks.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Masks ({selectedCard.occlusion.masks.length})</p>
                                            <div className="space-y-1">
                                                {selectedCard.occlusion.masks.map((m, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-text-primary">
                                                        <span className="size-2 rounded-full bg-terracotta shrink-0" />
                                                        <span>Group {m.groupIndex}{m.label ? ` — ${m.label}` : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        try {
                                            await buryMutation.mutateAsync(selectedCard.id)
                                            toast.success("Đã chôn thẻ")
                                        } catch (err) { handleError(err) }
                                    }}
                                    className="flex-1 rounded-xl gap-2 border-beige"
                                    disabled={buryMutation.isPending}
                                >
                                    <EyeOff size={16} /> Bury
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={async () => {
                                        try {
                                            await deleteNoteMutation.mutateAsync(selectedCard.noteId)
                                            toast.success("Đã xoá")
                                            setSelectedCard(null)
                                        } catch (err) { handleError(err) }
                                    }}
                                    className="flex-1 rounded-xl gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                    disabled={deleteNoteMutation.isPending}
                                >
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    )
}
