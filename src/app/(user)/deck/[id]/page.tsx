"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    BookOpen,
    Layers,
    Download,
    Star,
    Clock,
    Play,
    Share2,
    Folder,
    CopyPlus,
    Loader2Icon,
    Flag,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useDeck, useCloneDeck } from "@/queries/useDeckQuery"
import { useCreateReport } from "@/queries/useReportQuery"
import { timeAgo } from "@/utils/timeAgo"
import { StarRating } from "@/components/common/star-rating"
import { useUpsertReview } from "@/queries/useReviewQuery"
import { getColor } from "@/utils/getColor"
import { useAuthStore } from "@/stores/useAuthStore"
import { handleError } from "@/utils/handleError"
import { OverviewTab } from "./deck-detail-overview-tab"
import { NotesTab } from "./deck-detail-notes-tab"
import { CardsTab } from "./deck-detail-cards-tab"
import { ReviewsTab } from "./deck-detail-reviews-tab"
import { SettingsTab } from "./deck-detail-settings-tab"
import { DeckReportDialog } from "./report/deck-report-dialog"

export default function DeckDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { data: res, isLoading } = useDeck(id)
    const cloneMutation = useCloneDeck()
    const upsertReview = useUpsertReview()
    const createReport = useCreateReport()
    const [userRating, setUserRating] = React.useState(0)
    const [reportOpen, setReportOpen] = React.useState(false)
    const user = useAuthStore((s) => s.user)
    const deck = res?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2Icon className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!deck) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-lg font-bold text-text-muted">Deck không tồn tại</p>
                <Button variant="outline" onClick={() => window.history.back()}>Quay lại</Button>
            </div>
        )
    }

    const isOwner = deck.userId === user?.id

    if (!isOwner && !deck.isPublic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-lg font-bold text-text-muted">Deck không tồn tại</p>
                <Button variant="outline" onClick={() => window.history.back()}>Quay lại</Button>
            </div>
        )
    }

    const handleReportSubmit = async (data: any) => {
        try {
            await createReport.mutateAsync({ deckId: deck.id, data }, {
                onSuccess: (response: any) => {
                    toast.success(response?.data?.message || "Báo cáo thành công")
                    setReportOpen(false)
                },
                onError: (error: any) => {
                    handleError(error, "Không thể gửi báo cáo")
                },
            })
        } catch (error) { console.error("Report failed", error) }
    }

    const handleClone = async () => {
        try {
            const res = await cloneMutation.mutateAsync(deck.id)
            const cloned = res?.data?.data
            toast.success("Clone bộ thẻ thành công")
            if (cloned?.id) router.push(`/deck/${cloned.id}`)
        } catch (e) {
            handleError(e)
        }
    }

    return (
        <div className="max-w-full space-y-8 px-4 py-6 md:px-6">
            {/* Hero Section */}
            <section className="overflow-hidden rounded-[32px] border border-beige bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                    {deck.coverImage ? (
                        <img
                            src={deck.coverImage}
                            alt={deck.name}
                            className="h-full w-full object-cover opacity-95"
                        />
                    ) : (
                        <div className={`
                            flex h-full w-full items-center justify-center
                            ${getColor(deck.id)}
                        `}>
                            <div className="flex size-24 items-center justify-center rounded-3xl bg-white/40 shadow-inner backdrop-blur-sm transition-transform duration-300">
                                <Folder className="size-12 text-white" fill="currentColor" />
                            </div>
                        </div>
                    )}
                    {deck.coverImage && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />}

                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {deck.tags?.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                                    {tag}
                                </span>
                            ))}
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${deck.isPublic ? "bg-terracotta" : "bg-text-muted"}`}>
                                {deck.isPublic ? "Public" : "Private"}
                            </span>
                        </div>

                        <h1 className="text-2xl font-black text-white sm:text-3xl md:text-4xl tracking-tight">
                            {deck.name}
                        </h1>

                        {deck.description && (
                            <p className="mt-2 max-w-2xl text-sm sm:text-base text-near-white/90 font-medium leading-relaxed">
                                {deck.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phần tương tác dưới Hero */}
                <div className="p-6 md:p-8 bg-off-white">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Grid thống kê nhanh */}
                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                            <StatCard icon={<BookOpen className="size-4" />} label="Notes" value={String(deck._count?.notes ?? 0)} />
                            <StatCard icon={<Layers className="size-4" />} label="Cards" value={String(deck._count?.cards ?? 0)} />
                            <StatCard icon={<Download className="size-4" />} label="Downloads" value={String(deck.downloadCount ?? 0)} />
                            <div className="rounded-xl bg-cream/70 p-3.5 border border-beige/40 hover:bg-cream transition-colors">
                                <div className="mb-1.5 text-terracotta"><Star className="size-4 text-gold-dark fill-gold-dark" /></div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Rating</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-black text-text-primary">{deck.averageRating ?? 0}</p>
                                    <span className="text-[10px] text-text-muted">({deck.ratingCount ?? 0})</span>
                                </div>
                                <div className="mt-1">
                                    <StarRating
                                        value={userRating}
                                        onChange={(rating) => {
                                            setUserRating(rating)
                                            upsertReview.mutate({ deckId: deck.id, data: { rating } })
                                        }}
                                        size={14}
                                    />
                                </div>
                            </div>
                            <StatCard icon={<Clock className="size-4" />} label="Updated" value={timeAgo(deck.updatedAt)} />
                        </div>

                        {/* Nhóm Button Hành Động */}
                        <div className="flex gap-3 sm:justify-end">
                            <Button
                                variant="outline"
                                className="h-12 flex-1 sm:flex-initial rounded-xl border-beige bg-white text-text-primary font-bold transition-all hover:bg-cream hover:border-terracotta/20 px-5"
                            >
                                <Share2 className="mr-2 size-4 text-text-muted" />
                                Share
                            </Button>
                            {!isOwner && (
                                <Button
                                    variant="outline"
                                    onClick={() => setReportOpen(true)}
                                    className="h-12 flex-1 sm:flex-initial rounded-xl border-red-200 bg-white text-red-600 font-bold transition-all hover:bg-red-50 hover:border-red-300 px-4"
                                >
                                    <Flag className="size-4" />
                                </Button>
                            )}
                            {isOwner ? (
                                <Button
                                    className="h-12 flex-1 sm:flex-initial rounded-xl bg-terracotta text-white font-bold shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark hover:-translate-y-0.5 active:translate-y-0 px-6"
                                >
                                    <Play className="mr-2 size-4 fill-white" />
                                    Study Now
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleClone}
                                    disabled={cloneMutation.isPending}
                                    className="h-12 flex-1 sm:flex-initial rounded-xl bg-terracotta text-white font-bold shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark hover:-translate-y-0.5 active:translate-y-0 px-6"
                                >
                                    <CopyPlus className="mr-2 size-4" />
                                    {cloneMutation.isPending ? "Đang clone..." : "Clone Deck"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Điều Hướng */}
            <Tabs defaultValue="overview" className="w-full space-y-6">
                <div className="scrollbar-none overflow-x-auto pb-1">
                    <TabsList className="inline-flex h-auto rounded-2xl border border-beige bg-white p-1.5 shadow-sm">
                        <TabsTrigger value="overview" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="notes" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Notes ({deck._count?.notes ?? 0})
                        </TabsTrigger>
                        <TabsTrigger value="cards" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Cards ({deck._count?.cards ?? 0})
                        </TabsTrigger>

                        <TabsTrigger value="reviews" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Reviews
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="focus-visible:outline-none">
                    <OverviewTab deck={deck} />
                </TabsContent>

                <TabsContent value="notes" className="focus-visible:outline-none">
                    <NotesTab deckId={deck.id} isOwner={isOwner} />
                </TabsContent>

                <TabsContent value="cards" className="focus-visible:outline-none">
                    <CardsTab deckId={deck.id} />
                </TabsContent>

                <TabsContent value="reviews" className="focus-visible:outline-none">
                    <ReviewsTab deckId={deck.id} isOwner={isOwner} />
                </TabsContent>

                <TabsContent value="settings" className="focus-visible:outline-none">
                    <SettingsTab deckId={deck.id} isOwner={isOwner} />
                </TabsContent>
            </Tabs>

            <DeckReportDialog
                open={reportOpen}
                onOpenChange={setReportOpen}
                onSubmit={handleReportSubmit}
                loading={createReport.isPending}
            />
        </div>
    )
}


function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-cream/70 p-3.5 border border-beige/40 hover:bg-cream transition-colors">
            <div className="mb-1.5 text-terracotta">{icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
            <p className="mt-0.5 text-lg font-black text-text-primary">{value}</p>
        </div>
    )
}

