"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { Title } from "@/components/common/title"
import { EmptyState } from "@/components/common/empty-state"
import { DeckSkeleton } from "@/components/common/skeleton/deck-skeleton"
import { DeckCard } from "@/components/common/deck-card"
import { DataPagination } from "@/components/common/data-pagination"
import { PaginationInfo } from "@/components/common/pagination-info"
import { useMyDecks, useClonedDecks, usePublicDecks, useCreateDeck, useUpdateDeck, useDeleteDeck, useCloneDeck } from "@/queries/useDeckQuery"
import { CreateDeckInput, DeckParams, DeckResponse, UpdateDeckInput } from "@/schemas/deck.schema"
import { SortOrder, DeckSortBy } from "@/constants/sort"
import { handleError } from "@/utils/handleError"
import { PlusIcon } from "lucide-react"
import reportService from "@/services/report.service"
import { ReportReason } from "@/constants/type"
import { toast } from "sonner"
import { DeckFilter } from "./deck-filter"
import { DeckDialog } from "./deck-dialog"
import { DeckReportDialog } from "./deck-report-dialog"

export default function DeckPage() {
    const [params, setParams] = useState<DeckParams>({ page: 1, limit: 20, sortOrder: SortOrder.DESC, sort: DeckSortBy.CREATED_AT })
    const [searchValue, setSearchValue] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingDeck, setEditingDeck] = useState<DeckResponse | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteDeckId, setDeleteDeckId] = useState<string | null>(null)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportDeckId, setReportDeckId] = useState<string | null>(null)
    const [clonedParams, setClonedParams] = useState<DeckParams>({ page: 1, limit: 20, sortOrder: SortOrder.DESC, sort: DeckSortBy.CREATED_AT })
    const [clonedSearch, setClonedSearch] = useState("")
    const [publicParams, setPublicParams] = useState<DeckParams>({ page: 1, limit: 20, sortOrder: SortOrder.DESC, sort: DeckSortBy.CREATED_AT })
    const [publicSearch, setPublicSearch] = useState("")
    const { data, isLoading } = useMyDecks(params)
    const { data: clonedData, isLoading: clonedLoading } = useClonedDecks(clonedParams)
    const { data: publicData, isLoading: publicLoading } = usePublicDecks(publicParams)
    const createMutation = useCreateDeck()
    const updateMutation = useUpdateDeck()
    const deleteMutation = useDeleteDeck()
    const cloneMutation = useCloneDeck()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setParams((prev) => ({ ...prev, search: searchValue || undefined, page: 1 }))
    }

    const clearSearch = () => {
        setSearchValue("")
        setParams((prev) => ({ ...prev, search: undefined, page: 1 }))
    }

    const handleCreateSubmit = async (formData: CreateDeckInput) => {
        try {
            await createMutation.mutateAsync(formData, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Tạo bộ thẻ thành công")
                    setDialogOpen(false)
                },
                onError: (error: any) => {
                    handleError(error, "Tạo bộ thẻ thất bại")
                },
            })
        } catch (error) { console.error("Create deck failed", error) }
    }

    const handleEdit = (deck: DeckResponse) => {
        setEditingDeck(deck)
        setDialogOpen(true)
    }

    const handleUpdateSubmit = async (formData: UpdateDeckInput) => {
        if (!editingDeck) return
        try {
            await updateMutation.mutateAsync({ id: editingDeck.id, data: formData }, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Cập nhật bộ thẻ thành công")
                    setDialogOpen(false)
                    setEditingDeck(null)
                },
                onError: (error: any) => {
                    handleError(error, "Cập nhật bộ thẻ thất bại")
                },
            })
        } catch (error) { console.error("Update deck failed", error) }
    }

    const handleDeleteTrigger = (id: string) => {
        setDeleteDeckId(id)
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteDeckId) return
        try {
            await deleteMutation.mutateAsync(deleteDeckId, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Xóa bộ thẻ thành công")
                    setDeleteConfirmOpen(false)
                    setDeleteDeckId(null)
                },
                onError: (error: any) => {
                    handleError(error, "Xóa bộ thẻ thất bại")
                },
            })
        } catch (error) { console.error("Delete deck failed", error) }
    }

    const handleClone = async (id: string) => {
        try {
            await cloneMutation.mutateAsync(id, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Sao chép bộ thẻ thành công")
                },
                onError: (error: any) => {
                    handleError(error, "Sao chép thất bại")
                },
            })
        } catch (error) { console.error("Clone deck failed", error) }
    }

    const handleReport = (id: string) => {
        setReportDeckId(id)
        setReportDialogOpen(true)
    }

    const handleConfirmReport = async (reason: ReportReason, description?: string) => {
        if (!reportDeckId) return
        try {
            await reportService.create(reportDeckId, { reason, description })
            toast.success("Đã gửi báo cáo")
            setReportDialogOpen(false)
            setReportDeckId(null)
        } catch (error: any) {
            handleError(error, "Gửi báo cáo thất bại")
        }
    }

    const handleArchive = async (id: string) => {
        try {
            await updateMutation.mutateAsync({ id, data: { isArchived: true } }, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Đã lưu trữ bộ thẻ")
                },
                onError: (error: any) => {
                    handleError(error, "Lưu trữ thất bại")
                },
            })
        } catch (error) { console.error("Archive deck failed", error) }
    }

    const decks = ((data as any)?.data || []) as any[]
    const meta = (data as any)?.meta as { page: number; limit: number; total: number } | undefined
    const page = meta?.page ?? params.page ?? 1
    const limit = meta?.limit ?? params.limit ?? 20
    const total = meta?.total ?? 0
    const totalPages = Math.ceil(total / limit)

    const clonedDecks = ((clonedData as any)?.data || []) as any[]
    const clonedMeta = (clonedData as any)?.meta as { page: number; limit: number; total: number } | undefined
    const clonedPage = clonedMeta?.page ?? clonedParams.page ?? 1
    const clonedLimit = clonedMeta?.limit ?? clonedParams.limit ?? 20
    const clonedTotal = clonedMeta?.total ?? 0
    const clonedTotalPages = Math.ceil(clonedTotal / clonedLimit)

    const publicDecks = ((publicData as any)?.data || []) as any[]
    const publicMeta = (publicData as any)?.meta as { page: number; limit: number; total: number } | undefined
    const publicPage = publicMeta?.page ?? publicParams.page ?? 1
    const publicLimit = publicMeta?.limit ?? publicParams.limit ?? 20
    const publicTotal = publicMeta?.total ?? 0
    const publicTotalPages = Math.ceil(publicTotal / publicLimit)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Title title="Bộ thẻ của tôi" />
                <Button onClick={() => setDialogOpen(true)} className="bg-terracotta text-white px-6 h-11 rounded-xl font-semibold hover:bg-terracotta-dark">
                    <PlusIcon className="mr-2 size-4" /> Tạo bộ thẻ
                </Button>
            </div>

            <DeckFilter
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearch={handleSearch}
                onClear={clearSearch}
                sort={params.sort}
                onSortChange={(val) => setParams((prev) => ({ ...prev, sort: val as DeckSortBy, page: 1 }))}
            />

            {/* Deck grid */}
            {isLoading ? (
                <DeckSkeleton />
            ) : decks.length === 0 ? (
                <EmptyState
                    title="Bạn chưa có bộ thẻ nào"
                    description="Hãy tạo bộ thẻ đầu tiên để bắt đầu học nhé."
                    actionLabel="Tạo bộ thẻ"
                    onAction={() => setDialogOpen(true)}
                />
            ) : (
                <>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {decks.map((deck: any) => (
                            <DeckCard
                                key={deck.id}
                                deck={deck}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTrigger}
                                onArchive={handleArchive}
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <PaginationInfo
                            page={page}
                            limit={limit}
                            totalItems={total}
                            currentLength={decks.length}
                            label="bộ thẻ"
                        />
                        <DataPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
                        />
                    </div>
                </>
            )}

            <DeckDialog
                open={dialogOpen}
                onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingDeck(null) }}
                onSubmit={(editingDeck ? handleUpdateSubmit : handleCreateSubmit) as any}
                initialData={editingDeck}
                loading={createMutation.isPending || updateMutation.isPending}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleConfirmDelete}
                loading={deleteMutation.isPending}
            />

            <DeckReportDialog
                open={reportDialogOpen}
                onOpenChange={(open) => { setReportDialogOpen(open); if (!open) setReportDeckId(null) }}
                onConfirm={handleConfirmReport}
            />


            {/* Cloned decks */}
            <div className="mt-20 space-y-6">
                <Title title="Thẻ đã clone" />
                <DeckFilter
                    searchValue={clonedSearch}
                    onSearchChange={setClonedSearch}
                    onSearch={(e) => { e.preventDefault(); setClonedParams((prev) => ({ ...prev, search: clonedSearch || undefined, page: 1 })) }}
                    onClear={() => { setClonedSearch(""); setClonedParams((prev) => ({ ...prev, search: undefined, page: 1 })) }}
                    sort={clonedParams.sort}
                    onSortChange={(val) => setClonedParams((prev) => ({ ...prev, sort: val as DeckSortBy, page: 1 }))}
                />
                {clonedLoading ? (
                    <DeckSkeleton />
                ) : clonedDecks.length === 0 ? (
                    <EmptyState title="Chưa có thẻ đã clone" description="Khi bạn clone bộ thẻ từ người khác, chúng sẽ xuất hiện ở đây." />
                ) : (
                    <>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {clonedDecks.map((deck: any) => (
                                <DeckCard key={deck.id} deck={deck} />
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <PaginationInfo
                                page={clonedPage}
                                limit={clonedLimit}
                                totalItems={clonedTotal}
                                currentLength={clonedDecks.length}
                                label="bộ thẻ"
                            />
                            <DataPagination
                                page={clonedPage}
                                totalPages={clonedTotalPages}
                                onPageChange={(p) => setClonedParams((prev) => ({ ...prev, page: p }))}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Public decks */}
            <div className="mt-20 space-y-6">
                <Title title="Thẻ công khai từ cộng đồng" />
                <DeckFilter
                    searchValue={publicSearch}
                    onSearchChange={setPublicSearch}
                    onSearch={(e) => { e.preventDefault(); setPublicParams((prev) => ({ ...prev, search: publicSearch || undefined, page: 1 })) }}
                    onClear={() => { setPublicSearch(""); setPublicParams((prev) => ({ ...prev, search: undefined, page: 1 })) }}
                    sort={publicParams.sort}
                    onSortChange={(val) => setPublicParams((prev) => ({ ...prev, sort: val as DeckSortBy, page: 1 }))}
                />
                {publicLoading ? (
                    <DeckSkeleton />
                ) : publicDecks.length === 0 ? (
                    <EmptyState title="Chưa có thẻ công khai" />
                ) : (
                    <>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {publicDecks.map((deck: any) => (
                                <DeckCard key={deck.id} deck={deck} onClone={handleClone} onReport={handleReport} />
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <PaginationInfo
                                page={publicPage}
                                limit={publicLimit}
                                totalItems={publicTotal}
                                currentLength={publicDecks.length}
                                label="bộ thẻ"
                            />
                            <DataPagination
                                page={publicPage}
                                totalPages={publicTotalPages}
                                onPageChange={(p) => setPublicParams((prev) => ({ ...prev, page: p }))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
