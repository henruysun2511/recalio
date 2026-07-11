"use client"

import React from "react"
import { Settings, Loader2Icon, Pencil } from "lucide-react"
import { useDeckSetting } from "@/queries/useDeckSettingQuery"
import { DeckSettingDialog } from "./setting/deck-setting-dialog"

interface SettingsTabProps {
    deckId: string
    isOwner: boolean
}

export function SettingsTab({ deckId, isOwner }: SettingsTabProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const { data: res, isLoading } = useDeckSetting(deckId)
    const setting = (res as any)?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2Icon className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!setting) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-sm font-semibold text-text-muted">Không tìm thấy cài đặt</p>
            </div>
        )
    }

    return (
        <>
            <div className="rounded-[28px] border border-beige bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-beige pb-4">
                    <div className="flex items-center gap-2.5">
                        <Settings className="size-5 text-terracotta" />
                        <h3 className="text-xl font-black text-text-primary tracking-tight">Deck Configuration</h3>
                    </div>
                    {isOwner && (
                        <button
                            onClick={() => setDialogOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white transition-all hover:bg-terracotta-dark active:scale-95"
                        >
                            <Pencil className="size-4" />
                            Cấu hình
                        </button>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <SettingCard
                        title="Thuật toán"
                        value={setting.algorithm}
                        description="SRS algorithm used for scheduling reviews"
                    />
                    <SettingCard
                        title="Thẻ mới / Ngày"
                        value={`${setting.newCardsPerDay} cards`}
                        description="Number of fresh cards introduced daily"
                    />
                    <SettingCard
                        title="Ôn tập / Ngày"
                        value={`${setting.reviewsPerDay} cards`}
                        description="Cap limit for review queues per day"
                    />
                    <SettingCard
                        title="Bước học"
                        value={setting.learningSteps}
                        description="Spaced repetition step milestones (minutes)"
                    />
                    <SettingCard
                        title="Khoảng cách tối đa"
                        value={`${setting.maximumInterval} days`}
                        description="Max time gap for card reappearance"
                    />
                    <SettingCard
                        title="Ngưỡng ghi nhớ"
                        value={`${(setting.requestRetention * 100).toFixed(0)}%`}
                        description="Target retention rate for FSRS"
                    />
                </div>
            </div>

            {isOwner && setting && (
                <DeckSettingDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    deckId={deckId}
                    setting={setting}
                />
            )}
        </>
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
