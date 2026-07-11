"use client"

import React from "react"
import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useNotesByDeck, useUpdateNote, useDeleteNote } from "@/queries/useNoteQuery"
import { DataPagination } from "@/components/common/data-pagination"
import { EmptyState } from "@/components/common/empty-state"
import { NoteFilter } from "./note/note-filter"
import { NoteCard } from "./note/note-card"
import { NoteEditDialog } from "./note/note-edit-dialog"
import { NoteRelatedDialog } from "./note/note-related-dialog"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { SortOrder } from "@/constants/sort"
import { toast } from "sonner"
import { handleError } from "@/utils/handleError"
import { PartOfSpeech } from "@/constants/type"
import type { Note } from "@/schemas/note.schema"

interface NotesTabProps {
    deckId: string
    isOwner: boolean
}

export function NotesTab({ deckId, isOwner }: NotesTabProps) {
    const router = useRouter()
    const [page, setPage] = React.useState(1)
    const [search, setSearch] = React.useState("")
    const [sort, setSort] = React.useState<"createdAt" | "updatedAt" | "word">("createdAt")
    const [sortOrder, setSortOrder] = React.useState(SortOrder.DESC)
    const [editNote, setEditNote] = React.useState<Note | null>(null)
    const [deleteNote, setDeleteNote] = React.useState<Note | null>(null)
    const [relatedNote, setRelatedNote] = React.useState<Note | null>(null)
    const limit = 30

    const params = React.useMemo(
        () => ({ page, limit, search: search || undefined, sort, sortOrder }),
        [page, search, sort, sortOrder],
    )

    const { data: res, isLoading } = useNotesByDeck(deckId, params)
    const notes: Note[] = (res as any)?.data ?? []
    const meta = (res as any)?.meta
    const totalPages = meta?.totalPages ?? 0

    const updateMutation = useUpdateNote()
    const deleteMutation = useDeleteNote()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
    }

    const handleClear = () => {
        setSearch("")
        setPage(1)
    }

    const handleSortChange = (value: string) => {
        setSort(value as "createdAt" | "updatedAt" | "word")
        setPage(1)
    }

    const handleSortOrderChange = (value: string) => {
        setSortOrder(value as SortOrder)
        setPage(1)
    }

    const handleRelated = (note: Note) => {
        setRelatedNote(note)
    }

    const handleEdit = (note: Note) => {
        setEditNote(note)
    }

    const handleSaveEdit = async (input: { word: string; meaning: string; ipa?: string; partOfSpeech?: string; example?: string; imageUrl?: string | null }) => {
        if (!editNote) return
        try {
            const data: Record<string, unknown> = {
                word: input.word,
                meaning: input.meaning,
                ipa: input.ipa,
                partOfSpeech: input.partOfSpeech as PartOfSpeech | undefined,
                example: input.example,
            }
            if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl

            await updateMutation.mutateAsync({ id: editNote.id, data: data as any })
            toast.success("Cập nhật từ vựng thành công")
            setEditNote(null)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = (note: Note) => {
        setDeleteNote(note)
    }

    const handleConfirmDelete = async () => {
        if (!deleteNote) return
        try {
            await deleteMutation.mutateAsync(deleteNote.id)
            toast.success("Xóa từ vựng thành công")
            setDeleteNote(null)
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className="space-y-5">
            <NoteFilter
                searchValue={search}
                onSearchChange={setSearch}
                onSearch={handleSearch}
                onClear={handleClear}
                sort={sort}
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
                showAddButton={isOwner}
                onAdd={() => router.push(`/deck/${deckId}/create-notes`)}
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2Icon className="size-8 animate-spin text-terracotta" />
                </div>
            ) : notes.length === 0 ? (
                <EmptyState
                    title="Chưa có từ vựng nào"
                    description={search ? "Không tìm thấy kết quả phù hợp." : "Bộ thẻ này chưa có từ vựng nào."}
                />
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            isOwner={isOwner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRelated={handleRelated}
                        />
                    ))}

                    {totalPages > 1 && (
                        <div className="pt-2">
                            <DataPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            )}

            <NoteEditDialog
                open={!!editNote}
                onOpenChange={(open) => { if (!open) setEditNote(null) }}
                note={editNote}
                onSave={handleSaveEdit}
                loading={updateMutation.isPending}
            />

            <NoteRelatedDialog
                open={!!relatedNote}
                onOpenChange={(open) => { if (!open) setRelatedNote(null) }}
                word={relatedNote?.word ?? ""}
                languageId={relatedNote?.languageId ?? ""}
            />

            <ConfirmDialog
                open={!!deleteNote}
                onOpenChange={(open) => { if (!open) setDeleteNote(null) }}
                onConfirm={handleConfirmDelete}
                loading={deleteMutation.isPending}
                title="Xóa từ vựng"
                description={`Bạn có chắc muốn xóa "${deleteNote?.word}"? Hành động này không thể hoàn tác.`}
                buttonText="Xóa"
            />
        </div>
    )
}
