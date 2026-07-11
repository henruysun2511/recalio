import { BookOpen, Layers, Brain, BarChart3, Loader2Icon } from "lucide-react"
import { timeAgo } from "@/utils/timeAgo"
import { UserAvatar } from "@/components/common/user-avatar"
import { useCardStats } from "@/queries/useCardQuery"
import type { DeckResponse } from "@/schemas/deck.schema"
import Link from "next/link"

export function OverviewTab({ deck }: { deck: DeckResponse }) {
    const p = deck.progress
    const { data: cardStatsRes, isLoading: cardStatsLoading } = useCardStats(deck.id)
    const cardStats = (cardStatsRes as any)?.data

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <SectionCard title="Description">
                    <p className="leading-relaxed text-text-primary font-medium">
                        {deck.description || "No description provided."}
                    </p>
                </SectionCard>

                {p && (
                    <SectionCard title="Learning Progress">
                        <div className="space-y-4">
                            <ProgressItem label="Retention Rate" value={`${p.retentionRate}%`} colorClass="bg-green-soft" textDark />
                            <ProgressItem label="Due Today" value={String(p.dueCards)} colorClass="bg-yellow-soft" textDark />
                            <ProgressItem label="Total Reviews Done" value={String(p.totalReviews)} colorClass="bg-terracotta" />
                        </div>
                    </SectionCard>
                )}

                <SectionCard title="Card Statistics">
                    {cardStatsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2Icon className="size-6 animate-spin text-terracotta" />
                        </div>
                    ) : cardStats ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                            <MiniStat icon={<Layers className="size-4" />} label="Total" value={String(cardStats.total)} />
                            <MiniStat icon={<BookOpen className="size-4" />} label="New" value={String(cardStats.new)} />
                            <MiniStat icon={<Brain className="size-4" />} label="Learning" value={String(cardStats.learning)} />
                            <MiniStat icon={<BarChart3 className="size-4" />} label="Review" value={String(cardStats.review)} />
                            <MiniStat icon={<BarChart3 className="size-4" />} label="Due" value={String(cardStats.due)} />
                        </div>
                    ) : (
                        <p className="text-sm font-semibold text-text-muted">No card data available.</p>
                    )}
                </SectionCard>
            </div>

            <div className="space-y-6">
                <SectionCard title="Author">
                    <Link href={`/profile/${deck.user?.username}`}>
                        <div className="flex items-center gap-4">
                            <UserAvatar
                                avatarUrl={deck.user?.avatarUrl}
                                fullName={deck.user?.displayName}
                                username={deck.user?.username}
                                className="size-14 border-2 border-beige shadow-sm"
                            />
                            <div>
                                <p className="font-bold text-text-primary text-base">{deck.user?.displayName || deck.user?.username || "Unknown"}</p>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Deck Creator</p>
                            </div>
                        </div>
                    </Link>
                </SectionCard>

                <SectionCard title="Details">
                    <div className="divide-y divide-beige/60 text-sm">
                        <Row label="Language" value={deck.tags?.[0] || "N/A"} />
                        <Row label="Visibility" value={deck.isPublic ? "Public" : "Private"} />
                        <Row label="Category" value={deck.tags?.[1] || "N/A"} />
                        <Row label="Created" value={timeAgo(deck.createdAt)} />
                    </div>
                </SectionCard>
            </div>
        </div>
    )
}

function SectionCard({ title, children }: React.PropsWithChildren<{ title: string }>) {
    return (
        <div className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-text-primary tracking-tight">{title}</h3>
            {children}
        </div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between py-3.5 first:pt-1 last:pb-1">
            <span className="font-bold text-text-muted text-sm">{label}</span>
            <span className="font-bold text-text-primary text-sm">{value}</span>
        </div>
    )
}

function ProgressItem({ label, value, colorClass, textDark }: { label: string; value: string; colorClass: string; textDark?: boolean }) {
    return (
        <div>
            <div className="mb-2 flex justify-between text-sm font-bold text-text-primary">
                <span>{label}</span>
                <span className={textDark ? "text-text-primary" : "text-terracotta"}>{value}</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-beige/60 p-0.5 border border-beige/20">
                <div className={`h-full rounded-full ${colorClass} transition-all duration-500`} style={{ width: typeof value === 'string' && value.endsWith('%') ? value : `${Math.min(Number(value) * 5, 100)}%` }} />
            </div>
        </div>
    )
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-cream/60 p-3.5 border border-beige/40">
            <div className="mb-1.5 text-terracotta">{icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
            <p className="mt-0.5 text-lg font-black text-text-primary">{value}</p>
        </div>
    )
}
