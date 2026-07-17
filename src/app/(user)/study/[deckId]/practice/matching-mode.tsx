"use client"

import { useState, useMemo } from "react"
import { Check, ArrowLeft, RefreshCw } from "lucide-react"

interface Props { notes: any[]; deckName?: string; onBack: () => void }

export function MatchingMode({ notes, deckName, onBack }: Props) {
    const pairs = useMemo(() => {
        return notes.slice(0, 8).filter((n: any) => n?.word && n?.meaning).map((n: any) => ({
            id: n.id, word: n.word, meaning: n.meaning,
        }))
    }, [notes])

    const [selectedWord, setSelectedWord] = useState<string | null>(null)
    const [matched, setMatched] = useState<Set<string>>(new Set())
    const [wrong, setWrong] = useState<string | null>(null)
    const [done, setDone] = useState(false)
    const [attempts, setAttempts] = useState(0)

    const shuffledMeanings = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs])

    const handleWord = (id: string) => {
        if (matched.has(id)) return
        setSelectedWord(id); setWrong(null)
    }

    const handleMeaning = (id: string) => {
        if (!selectedWord || matched.has(id)) return
        setAttempts((a) => a + 1)
        if (selectedWord === id) {
            const next = new Set(matched); next.add(id)
            setMatched(next); setSelectedWord(null)
            if (next.size === pairs.length) setDone(true)
        } else {
            setWrong(id)
            setTimeout(() => setWrong(null), 600)
        }
    }

    if (done) {
        const pct = attempts > 0 ? Math.round((pairs.length / attempts) * 100) : 0
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-beige bg-white py-16 px-6 text-center shadow-sm">
                <h2 className="text-2xl font-black text-text-primary">Ghép xong!</h2>
                <p className="mt-1 text-text-muted">{deckName}</p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Cặp</p><p className="text-2xl font-black text-text-primary">{pairs.length}</p></div>
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Lần thử</p><p className="text-2xl font-black text-text-primary">{attempts}</p></div>
                </div>
                <p className="mt-4 text-lg font-bold text-text-primary">{pct}% hiệu quả</p>
                <div className="mt-6 flex gap-3">
                    <button onClick={onBack} className="rounded-xl border border-beige bg-white px-6 py-3 text-sm font-semibold text-text-primary hover:bg-cream"><ArrowLeft className="inline size-4 mr-1" /> Chọn mode</button>
                    <button onClick={() => { setMatched(new Set()); setSelectedWord(null); setDone(false); setAttempts(0) }} className="rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"><RefreshCw className="inline size-4 mr-1" /> Làm lại</button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"><ArrowLeft className="size-4" /> Chọn mode</button>
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-text-muted uppercase">Ghép cặp</span>
                    <span className="text-sm font-medium text-text-muted">{matched.size}/{pairs.length} cặp</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-text-muted mb-2">Từ vựng</p>
                        {pairs.map((p) => {
                            const isMatched = matched.has(p.id)
                            const isSelected = selectedWord === p.id
                            return (
                                <button key={p.id} onClick={() => handleWord(p.id)} disabled={isMatched}
                                    className={`w-full rounded-xl border-2 p-3 text-sm font-semibold transition-all ${isMatched ? "border-green-300 bg-green-50 text-green-600" : isSelected ? "border-terracotta bg-terracotta/10" : "border-beige bg-white hover:bg-cream"}`}>
                                    {isMatched ? <><Check className="inline size-3.5 mr-1" /> {p.word}</> : p.word}
                                </button>
                            )
                        })}
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase text-text-muted mb-2">Nghĩa</p>
                        {shuffledMeanings.filter(p => !matched.has(p.id)).map((p) => {
                            const isWrong = wrong === p.id
                            return (
                                <button key={p.id} onClick={() => handleMeaning(p.id)}
                                    className={`w-full rounded-xl border-2 p-3 text-sm font-medium transition-all ${isWrong ? "border-red-400 bg-red-50 animate-pulse" : "border-beige bg-white hover:bg-cream"}`}>
                                    {p.meaning}
                                </button>
                            )
                        })}
                    </div>
                </div>
                {selectedWord && <p className="mt-4 text-center text-xs text-text-muted">Chọn nghĩa tương ứng</p>}
            </div>
        </div>
    )
}
