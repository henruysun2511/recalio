"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Volume2, ListChecks, Shuffle, SpellCheck, FileText, Combine } from "lucide-react"
import { useDeck } from "@/queries/useDeckQuery"
import { useNotesByDeck } from "@/queries/useNoteQuery"
import { SortOrder } from "@/constants/sort"
import { pastelColors } from "@/utils/getColor"

import { DictationMode } from "./dictation-mode"
import { MultipleChoiceMode } from "./multiple-choice-mode"
import { MatchingMode } from "./matching-mode"
import { SpellingMode } from "./spelling-mode"
import { FillBlankMode } from "./fill-blank-mode"
import { WordScrambleMode } from "./word-scramble-mode"

const modes = [
    { id: "dictation", icon: Volume2, label: "Nghe chép chính tả", desc: "Nghe phát âm và viết lại từ" },
    { id: "word-scramble", icon: Combine, label: "Sắp xếp chữ cái", desc: "Sắp xếp các chữ cái để tạo thành từ" },
    { id: "fill-blank", icon: FileText, label: "Điền khuyết", desc: "Điền từ còn thiếu vào câu ví dụ" },
    { id: "multiple-choice", icon: ListChecks, label: "Trắc nghiệm", desc: "Chọn nghĩa đúng từ 4 lựa chọn" },
    { id: "matching", icon: Shuffle, label: "Ghép cặp", desc: "Nối từ vựng với nghĩa tương ứng" },
    { id: "spelling", icon: SpellCheck, label: "Chính tả", desc: "Viết lại từ dựa vào gợi ý" },
]

export default function PracticePage() {
    const { deckId } = useParams<{ deckId: string }>()
    const { data: deckRes } = useDeck(deckId)
    const { data: notesRes } = useNotesByDeck(deckId, { page: 1, limit: 100, sort: "word", sortOrder: SortOrder.ASC })
    const deck = (deckRes as any)?.data
    const notes = ((notesRes as any)?.data ?? []) as any[]
    const [activeMode, setActiveMode] = useState<string | null>(null)

    const filtered = notes.filter((n: any) => n?.word)

    if (activeMode === "dictation") return <DictationMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />
    if (activeMode === "word-scramble") return <WordScrambleMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />
    if (activeMode === "fill-blank") return <FillBlankMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />
    if (activeMode === "multiple-choice") return <MultipleChoiceMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />
    if (activeMode === "matching") return <MatchingMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />
    if (activeMode === "spelling") return <SpellingMode notes={filtered} deckName={deck?.name} onBack={() => setActiveMode(null)} />

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight">
                        {deck?.name ?? "Luyện tập"}
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Chọn kiểu luyện tập phù hợp với bạn</p>
                </div>
                <span className="rounded-full border border-beige bg-white px-3 py-1.5 text-xs font-bold text-text-muted">
                    {filtered.length} từ
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modes.map((mode, i) => {
                    const Icon = mode.icon
                    const bg = pastelColors[i % pastelColors.length]
                    return (
                        <button key={mode.id} onClick={() => setActiveMode(mode.id)}
                            className={`group relative rounded-2xl border border-beige p-5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${bg}`}>
                            <div className="mb-3 inline-flex rounded-xl bg-white/60 p-2.5 backdrop-blur-sm">
                                <Icon className="size-5 text-text-primary" />
                            </div>
                            <h3 className="text-base font-bold text-text-primary">{mode.label}</h3>
                            <p className="mt-1 text-sm text-text-muted leading-relaxed">{mode.desc}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
