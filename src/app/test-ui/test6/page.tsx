"use client"

import React from "react"
import {
    BookOpen,
    Layers,
    Download,
    Star,
    Clock,
    Play,
    Settings,
    MessageSquare,
    BarChart3,
    User,
    ChevronRight,
    Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function DeckDetailPage() {
    return (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-6">
            {/* Hero Section */}
            <section className="overflow-hidden rounded-[32px] border border-beige bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative h-64 sm:h-72 md:h-80 bg-peach">
                    <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                        alt="IELTS Vocabulary Banner"
                        className="h-full w-full object-cover opacity-95"
                    />
                    {/* Overlay gradient tinh tế hơn */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                    {/* Nội dung trên Hero */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                        <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                                English
                            </span>
                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                                IELTS
                            </span>
                            <span className="rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white">
                                Public
                            </span>
                        </div>

                        <h1 className="text-2xl font-black text-white sm:text-3xl md:text-4xl tracking-tight">
                            IELTS Vocabulary 2025
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm sm:text-base text-near-white/90 font-medium leading-relaxed">
                            Essential IELTS vocabulary and collocations for Band 7.0+ preparation and academic writing.
                        </p>
                    </div>
                </div>

                {/* Phần tương tác dưới Hero */}
                <div className="p-6 md:p-8 bg-off-white">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Grid thống kê nhanh */}
                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                            <StatCard icon={<BookOpen className="size-4" />} label="Notes" value="125" />
                            <StatCard icon={<Layers className="size-4" />} label="Cards" value="250" />
                            <StatCard icon={<Download className="size-4" />} label="Downloads" value="1.2k" />
                            <StatCard icon={<Star className="size-4 text-gold-dark fill-gold-dark" />} label="Rating" value="4.8" />
                            <StatCard icon={<Clock className="size-4" />} label="Updated" value="2 days ago" />
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
                            <Button
                                className="h-12 flex-1 sm:flex-initial rounded-xl bg-terracotta text-white font-bold shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark hover:-translate-y-0.5 active:translate-y-0 px-6"
                            >
                                <Play className="mr-2 size-4 fill-white" />
                                Study Now
                            </Button>
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
                            Notes ({125})
                        </TabsTrigger>
                        <TabsTrigger value="cards" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Cards ({250})
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Statistics
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Reviews
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab: Overview */}
                <TabsContent value="overview" className="focus-visible:outline-none">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <SectionCard title="Description">
                                <p className="leading-relaxed text-text-primary font-medium">
                                    This deck contains common IELTS vocabulary, collocations, phrasal verbs, and academic
                                    expressions frequently appearing in reading, writing, and speaking tests. Perfect for self-study and interval repetition.
                                </p>
                            </SectionCard>

                            <SectionCard title="Learning Progress">
                                <div className="space-y-5 py-2">
                                    <ProgressItem label="Learned Cards" value="65%" colorClass="bg-terracotta" />
                                    <ProgressItem label="Mastered (Mature)" value="42%" colorClass="bg-green-soft" textDark />
                                    <ProgressItem label="Review Due Today" value="18%" colorClass="bg-yellow-soft" textDark />
                                </div>
                            </SectionCard>
                        </div>

                        <div className="space-y-6">
                            <SectionCard title="Author">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-peach-light text-terracotta shadow-inner">
                                        <User className="size-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-base">Huy Sun</p>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Deck Creator</p>
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard title="Details">
                                <div className="divide-y divide-beige/60 text-sm">
                                    <Row label="Language" value="English" />
                                    <Row label="Visibility" value="Public" />
                                    <Row label="Category" value="IELTS Exam" />
                                    <Row label="Created" value="Jun 2025" />
                                </div>
                            </SectionCard>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Notes */}
                <TabsContent value="notes" className="focus-visible:outline-none">
                    <div className="rounded-[28px] border border-beige bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-xl font-black text-text-primary tracking-tight">Vocabulary Notes</h3>
                            <span className="text-xs font-bold text-text-muted bg-near-white border border-beige px-3 py-1 rounded-full">Showing 5 items</span>
                        </div>

                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between rounded-2xl border border-beige bg-off-white p-4 transition-all hover:border-terracotta/30 hover:bg-white"
                                >
                                    <div>
                                        <h4 className="font-bold text-text-primary group-hover:text-terracotta transition-colors">
                                            Vocabulary #{i + 1}
                                        </h4>
                                        <p className="mt-1 text-sm text-text-muted font-medium">
                                            Sample note content containing meanings, phonetics, and context examples...
                                        </p>
                                    </div>
                                    <ChevronRight className="size-5 text-text-muted group-hover:text-terracotta transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Cards */}
                <TabsContent value="cards" className="focus-visible:outline-none">
                    <div className="rounded-[28px] border border-beige bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-xl font-black text-text-primary tracking-tight">Flashcards Preview</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col justify-between rounded-2xl border border-beige bg-cream/40 p-5 shadow-sm transition-all hover:scale-[1.01] hover:border-peach"
                                >
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted bg-beige px-2 py-0.5 rounded-md">Front</span>
                                        <p className="mt-3 font-bold text-text-primary text-base">What does "abandon" mean?</p>
                                    </div>

                                    <div className="my-4 border-t border-beige/80 border-dashed" />

                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-terracotta bg-peach px-2 py-0.5 rounded-md">Back</span>
                                        <p className="mt-3 text-sm font-medium text-text-muted">To leave something behind completely or give up a draft completely.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Stats */}
                <TabsContent value="stats" className="focus-visible:outline-none">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <StatPanel title="Total Reviews" value="3,421" icon={<BarChart3 className="size-6" />} />
                        <StatPanel title="Retention Rate" value="92%" icon={<Star className="size-6 fill-terracotta" />} />
                        <StatPanel title="Total Study Time" value="47 hours" icon={<Clock className="size-6" />} />
                    </div>
                </TabsContent>

                {/* Tab: Reviews */}
                <TabsContent value="reviews" className="focus-visible:outline-none">
                    <div className="rounded-[28px] border border-beige bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-xl font-black text-text-primary tracking-tight">Community Reviews</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="rounded-2xl border border-beige bg-off-white p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-beige text-text-primary font-bold text-xs">U{item}</div>
                                            <span className="font-bold text-text-primary text-sm">User_Profile_{item}</span>
                                        </div>
                                        <div className="flex gap-0.5 text-gold-dark">
                                            {Array.from({ length: 5 }).map((_, s) => (
                                                <Star key={s} className="size-3.5 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-text-primary/90 pl-1">
                                        "Very useful deck for IELTS preparation. Curated cleanly, definitions and examples are accurate to academic criteria."
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Settings */}
                <TabsContent value="settings" className="focus-visible:outline-none">
                    <div className="rounded-[28px] border border-beige bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2.5 border-b border-beige pb-4">
                            <Settings className="size-5 text-terracotta" />
                            <h3 className="text-xl font-black text-text-primary tracking-tight">Deck Configuration</h3>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <SettingCard title="New Cards / Day" value="20 cards" description="Number of fresh cards introduced daily" />
                            <SettingCard title="Maximum Reviews / Day" value="100 cards" description="Cap limit for review queues per day" />
                            <SettingCard title="Learning Steps Interval" value="1 min, 10 min" description="Spaced repetition step milestones" />
                            <SettingCard title="Maximum Review Interval" value="365 days" description="Max time gap for card reappearance" />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Subcomponents helper
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl bg-cream/70 p-3.5 border border-beige/40 hover:bg-cream transition-colors">
            <div className="mb-1.5 text-terracotta">{icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
            <p className="mt-0.5 text-lg font-black text-text-primary">{value}</p>
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
                <div className={`h-full rounded-full ${colorClass} transition-all duration-500`} style={{ width: value }} />
            </div>
        </div>
    )
}

function StatPanel({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm transition-transform hover:translate-y-[-2px]">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-cream text-terracotta">
                {icon}
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-text-muted">{title}</p>
            <p className="mt-2 text-3xl font-black text-text-primary tracking-tight">{value}</p>
        </div>
    )
}

function SettingCard({ title, value, description }: { title: string; value: string; description: string }) {
    return (
        <div className="rounded-2xl bg-cream/40 border border-beige/60 p-5 hover:bg-cream/70 transition-colors">
            <p className="text-xs font-black uppercase tracking-wider text-terracotta">{title}</p>
            <p className="mt-2 text-xl font-black text-text-primary tracking-tight">{value}</p>
            <p className="mt-1 text-xs font-semibold text-text-muted leading-normal">{description}</p>
        </div>
    )
}