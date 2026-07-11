"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BookOpen, ArrowLeft, FileSpreadsheet, Sparkles, ImageIcon, Loader2 } from "lucide-react"

import { useDeck } from "@/queries/useDeckQuery"
import { ManualTab } from "./manual-tab"
import { AiGenerateFromTextTab } from "./ai-generate-from-text-tab"
import { AiGenerateFromTopicTab } from "./ai-generate-from-topic-tab"
import { AiGenerateFromImageTab } from "./ai-generate-from-image-tab"
import { CsvImportTab } from "./csv-import-tab"

const TABS = [
    { key: "manual", label: "Manual", icon: BookOpen },
    { key: "csv", label: "Import CSV", icon: FileSpreadsheet },
    { key: "ai-generate-from-text", label: "AI Generate From Text", icon: Sparkles },
    { key: "ai-generate-from-topic", label: "AI Generate From Topic", icon: Sparkles },
    { key: "ai-generate-from-image", label: "AI Generate From Image", icon: ImageIcon },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function CreateNotePage() {
    const { id: deckId } = useParams<{ id: string }>()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabKey>("manual")
    const { data: deckRes } = useDeck(deckId)
    const deck = deckRes?.data

    return (
        <div className="max-w-full space-y-6 px-4 py-6 md:px-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push(`/deck/${deckId}`)}
                    className="size-10 rounded-xl border border-beige bg-white flex items-center justify-center hover:bg-cream transition-colors"
                >
                    <ArrowLeft className="size-5 text-text-primary" />
                </button>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-0.5">
                        {deck?.name ?? <Loader2 className="size-3 inline animate-spin" />}
                    </p>
                    <h1 className="text-2xl font-black text-text-primary tracking-tighter">
                        Add Cards
                    </h1>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 bg-cream/50 rounded-2xl p-1.5 border border-beige w-fit overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        data-active={activeTab === tab.key}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap data-[active=true]:bg-white data-[active=true]:text-terracotta data-[active=true]:shadow-sm text-text-muted hover:text-text-primary"
                    >
                        <tab.icon className="size-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === "manual" && <ManualTab deckId={deckId} />}
            {activeTab === "ai-generate-from-text" && <AiGenerateFromTextTab deckId={deckId} />}
            {activeTab === "csv" && <CsvImportTab deckId={deckId} />}
            {activeTab === "ai-generate-from-topic" && <AiGenerateFromTopicTab deckId={deckId} />}
            {activeTab === "ai-generate-from-image" && <AiGenerateFromImageTab deckId={deckId} />}
        </div>
    )
}
