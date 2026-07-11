"use client"

import React from "react"
import { FileText, PlusIcon, Pencil, Trash2, ChevronRight, ChevronDown, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useNoteTemplates, useNoteTemplate, useCreateNoteTemplate, useUpdateNoteTemplate, useDeleteNoteTemplate, useCreateCardTemplate, useUpdateCardTemplate, useDeleteCardTemplate, NOTE_TEMPLATE_QUERY_KEY } from "@/queries/useNoteTemplateQuery"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { handleError } from "@/utils/handleError"
import { TemplateFilter } from "./template-filter"
import { NoteTemplateDialog } from "./note-template-dialog"
import { CardTemplateDialog } from "./card-template-dialog"
import type { NoteTemplate, CardTemplate } from "@/schemas/note-template.schema"

export default function AdminTemplatePage() {
    const queryClient = useQueryClient()

    const [search, setSearch] = React.useState("")
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [ntDialogOpen, setNtDialogOpen] = React.useState(false)
    const [editingNt, setEditingNt] = React.useState<NoteTemplate | null>(null)
    const [ctDialogOpen, setCtDialogOpen] = React.useState(false)
    const [editingCt, setEditingCt] = React.useState<CardTemplate | null>(null)
    const [deleteNtId, setDeleteNtId] = React.useState<string | null>(null)
    const [deleteCtId, setDeleteCtId] = React.useState<string | null>(null)

    const { data: listRes, isLoading: listLoading } = useNoteTemplates()
    const allTemplates: NoteTemplate[] = (listRes as any)?.data ?? []

    const { data: detailRes, isLoading: detailLoading } = useNoteTemplate(selectedId ?? "")
    const selected = (detailRes as any)?.data ?? null

    const createNt = useCreateNoteTemplate()
    const updateNt = useUpdateNoteTemplate()
    const deleteNt = useDeleteNoteTemplate()
    const createCt = useCreateCardTemplate()
    const updateCt = useUpdateCardTemplate()
    const deleteCt = useDeleteCardTemplate()

    const invalidateDetail = () => {
        if (selectedId) {
            queryClient.invalidateQueries({ queryKey: [...NOTE_TEMPLATE_QUERY_KEY, selectedId] })
        }
    }

    const filtered = search
        ? allTemplates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
        : allTemplates

    // ── Note Template handlers ──
    const handleCreateNt = async (data: any) => {
        try {
            await createNt.mutateAsync(data)
            toast.success("Tạo template thành công")
            setNtDialogOpen(false)
        } catch (e) { handleError(e) }
    }

    const handleUpdateNt = async (data: any) => {
        if (!editingNt) return
        try {
            await updateNt.mutateAsync({ id: editingNt.id, data })
            toast.success("Cập nhật template thành công")
            setEditingNt(null)
            setNtDialogOpen(false)
        } catch (e) { handleError(e) }
    }

    const handleDeleteNt = async () => {
        if (!deleteNtId) return
        try {
            await deleteNt.mutateAsync(deleteNtId)
            toast.success("Xoá template thành công")
            setDeleteNtId(null)
            if (selectedId === deleteNtId) setSelectedId(null)
        } catch (e) { handleError(e) }
    }

    const openEditNt = (t: NoteTemplate) => {
        setEditingNt(t)
        setNtDialogOpen(true)
    }

    const openCreateNt = () => {
        setEditingNt(null)
        setNtDialogOpen(true)
    }

    // ── Card Template handlers ──
    const handleCreateCt = async (data: any) => {
        if (!selectedId) return
        try {
            await createCt.mutateAsync({ noteTemplateId: selectedId, data })
            toast.success("Tạo card template thành công")
            setCtDialogOpen(false)
            invalidateDetail()
        } catch (e) { handleError(e) }
    }

    const handleUpdateCt = async (data: any) => {
        if (!editingCt || !selectedId) return
        try {
            await updateCt.mutateAsync({ noteTemplateId: selectedId, id: editingCt.id, data })
            toast.success("Cập nhật card template thành công")
            setEditingCt(null)
            setCtDialogOpen(false)
            invalidateDetail()
        } catch (e) { handleError(e) }
    }

    const handleDeleteCt = async () => {
        if (!deleteCtId || !selectedId) return
        try {
            await deleteCt.mutateAsync({ noteTemplateId: selectedId, id: deleteCtId })
            toast.success("Xoá card template thành công")
            setDeleteCtId(null)
            invalidateDetail()
        } catch (e) { handleError(e) }
    }

    const openEditCt = (ct: CardTemplate) => {
        setEditingCt(ct)
        setCtDialogOpen(true)
    }

    const openCreateCt = () => {
        setEditingCt(null)
        setCtDialogOpen(true)
    }

    const isPendingNt = createNt.isPending || updateNt.isPending
    const isPendingCt = createCt.isPending || updateCt.isPending

    return (
        <div data-role="admin">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                        Note Templates
                    </p>
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter">
                        Template Management
                    </h1>
                </div>
                <button
                    onClick={openCreateNt}
                    className="flex items-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark active:scale-95"
                >
                    <PlusIcon className="size-4" />
                    New Template
                </button>
            </div>

            <div className="flex gap-6">
                {/* Left Panel — Template List */}
                <div className="w-72 shrink-0 rounded-2xl border border-beige bg-white p-4 shadow-sm">
                    <div className="mb-3">
                        <TemplateFilter searchValue={search} onSearchChange={setSearch} onClear={() => { setSearch(""); setSelectedId(null) }} />
                    </div>

                    {listLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2Icon className="size-6 animate-spin text-terracotta" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <EmptyState title="Không có template" description="Chưa có template nào." />
                    ) : (
                        <div className="space-y-0.5">
                            {filtered.map((t) => {
                                const isSelected = t.id === selectedId
                                const expanded = selectedId === t.id
                                const cardCount = (selected?.id === t.id ? selected.cardTemplates?.length : 0) ?? 0
                                return (
                                    <div key={t.id}>
                                        <button
                                            onClick={() => setSelectedId(isSelected ? null : t.id)}
                                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-all ${
                                                isSelected
                                                    ? "bg-terracotta text-white shadow-sm"
                                                    : "text-text-primary hover:bg-beige/50"
                                            }`}
                                        >
                                            <span className="text-xs">
                                                {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                                            </span>
                                            <FileText className="size-4 shrink-0" />
                                            <span className="flex-1 truncate">{t.name}</span>
                                            {isSelected && (
                                                <span className="size-2 rounded-full bg-white" />
                                            )}
                                        </button>
                                        {expanded && cardCount > 0 && (
                                            <div className="ml-7 mt-0.5 space-y-0.5">
                                                {selected.cardTemplates.map((ct: CardTemplate) => (
                                                    <div
                                                        key={ct.id}
                                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-muted hover:bg-beige/40 transition-colors"
                                                    >
                                                        <FileText className="size-3 shrink-0" />
                                                        <span className="truncate">{ct.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Right Panel — Detail View */}
                <div className="flex-1 space-y-5">
                    {!selectedId || detailLoading ? (
                        <div className="flex items-center justify-center py-20 text-text-muted">
                            {detailLoading ? <Loader2Icon className="size-8 animate-spin text-terracotta" /> : <span className="text-sm font-semibold">Chọn một template để xem chi tiết</span>}
                        </div>
                    ) : !selected ? (
                        <EmptyState title="Template không tồn tại" description="Template này đã bị xoá hoặc không tồn tại." />
                    ) : (
                        <>
                            {/* Template Info Card */}
                            <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-text-primary tracking-tight">
                                            {selected.name}
                                        </h2>
                                        <p className="mt-1 text-sm font-semibold text-text-muted">
                                            Type: <span className="font-black text-terracotta uppercase">{selected.type}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditNt(selected)}
                                            className="flex items-center gap-1.5 rounded-xl border border-beige px-4 py-2 text-sm font-bold text-text-primary transition-all hover:bg-cream active:scale-95"
                                        >
                                            <Pencil className="size-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteNtId(selected.id)}
                                            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-50 active:scale-95"
                                        >
                                            <Trash2 className="size-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Fields</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.fieldNames.map((f: string) => (
                                            <span
                                                key={f}
                                                className="rounded-lg bg-cream border border-beige px-3 py-1.5 text-xs font-bold text-text-primary"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card Templates Section */}
                            <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                                        Card Templates
                                    </p>
                                    <button
                                        onClick={openCreateCt}
                                        className="flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2 text-xs font-bold text-white transition-all hover:bg-terracotta-dark active:scale-95"
                                    >
                                        <PlusIcon className="size-3.5" />
                                        Add
                                    </button>
                                </div>

                                {(!selected.cardTemplates || selected.cardTemplates.length === 0) ? (
                                    <EmptyState title="Chưa có card template" description="Thêm card template mới để bắt đầu." />
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {selected.cardTemplates.map((ct: CardTemplate) => (
                                            <div
                                                key={ct.id}
                                                className="rounded-xl border border-beige bg-cream/30 p-5 transition-all hover:border-terracotta/30 hover:shadow-sm"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h4 className="text-sm font-black text-text-primary tracking-tight">
                                                        {ct.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => openEditCt(ct)}
                                                            className="rounded-lg p-1.5 text-text-muted transition-all hover:bg-beige hover:text-text-primary"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteCtId(ct.id)}
                                                            className="rounded-lg p-1.5 text-text-muted transition-all hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">Front</p>
                                                        <div className="rounded-lg border border-beige bg-white p-3 font-mono text-xs text-text-primary break-all">
                                                            {ct.frontHtml}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">Back</p>
                                                        <div className="rounded-lg border border-beige bg-white p-3 font-mono text-xs text-text-primary break-all whitespace-pre-wrap">
                                                            {ct.backHtml}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <NoteTemplateDialog
                open={ntDialogOpen}
                onOpenChange={(v) => { setNtDialogOpen(v); if (!v) setEditingNt(null) }}
                onSubmit={editingNt ? handleUpdateNt : handleCreateNt}
                initialData={editingNt}
                loading={isPendingNt}
            />

            <CardTemplateDialog
                open={ctDialogOpen}
                onOpenChange={(v) => { setCtDialogOpen(v); if (!v) setEditingCt(null) }}
                onSubmit={editingCt ? handleUpdateCt : handleCreateCt}
                initialData={editingCt}
                loading={isPendingCt}
            />

            <ConfirmDialog
                open={!!deleteNtId}
                onOpenChange={(v) => { if (!v) setDeleteNtId(null) }}
                onConfirm={handleDeleteNt}
                title="Xoá note template"
                description={`Bạn có chắc chắn muốn xoá template này? Hành động này không thể hoàn tác.`}
                buttonText="Xoá template"
                loading={deleteNt.isPending}
            />

            <ConfirmDialog
                open={!!deleteCtId}
                onOpenChange={(v) => { if (!v) setDeleteCtId(null) }}
                onConfirm={handleDeleteCt}
                title="Xoá card template"
                description={`Bạn có chắc chắn muốn xoá card template này?`}
                buttonText="Xoá card template"
                loading={deleteCt.isPending}
            />
        </div>
    )
}
