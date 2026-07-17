"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowLeft, RefreshCw, Lightbulb, Sparkles } from "lucide-react"

interface Props { notes: any[]; deckName?: string; onBack: () => void }

const shakeStyle = `@keyframes shake { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }`

interface Tile { id: number; char: string }

export function WordScrambleMode({ notes, deckName, onBack }: Props) {
    const [index, setIndex] = useState(0)
    const [score, setScore] = useState({ correct: 0, wrong: 0 })
    const [done, setDone] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle")
    const note = notes[index]
    const word = note?.word ?? ""
    const meaning = note?.meaning ?? ""
    const ipa = note?.ipa ?? ""

    const tiles: Tile[] = useMemo(() => {
        const letters: Tile[] = word.split("").map((ch: string, i: number) => ({ id: i, char: ch }))
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[letters[i], letters[j]] = [letters[j], letters[i]]
        }
        if (letters.map((t: Tile) => t.char).join("").toLowerCase() === word.toLowerCase() && letters.length > 1) {
            return word.split("").map((ch: string, i: number) => ({ id: i, char: ch }))
        }
        return letters
    }, [word])

    const [picked, setPicked] = useState<number[]>([])
    const arranged = useMemo(() => picked.map((id) => tiles.find((t) => t.id === id)!.char), [picked, tiles])
    const remaining = useMemo(() => tiles.filter((t) => !picked.includes(t.id)), [tiles, picked])

    const advance = useCallback(() => {
        const nextIdx = index + 1
        if (nextIdx >= notes.length) setDone(true)
        else { setIndex(nextIdx); setPicked([]); setStatus("idle"); setShowHint(false) }
    }, [index, notes.length])

    const checkAnswer = useCallback((ids: number[]) => {
        const answer = ids.map((id) => tiles.find((t) => t.id === id)!.char).join("")
        if (answer.toLowerCase() === word.toLowerCase()) {
            setStatus("correct")
            setScore((s) => ({ ...s, correct: s.correct + 1 }))
            setTimeout(advance, 1200)
        } else {
            setStatus("wrong")
            setScore((s) => ({ ...s, wrong: s.wrong + 1 }))
            setTimeout(() => { setPicked([]); setStatus("idle") }, 800)
        }
    }, [tiles, word, advance])

    const pick = (id: number) => {
        if (status !== "idle") return
        const next = [...picked, id]
        setPicked(next)
        if (next.length === tiles.length) checkAnswer(next)
    }

    const unstick = (id: number) => {
        if (status !== "idle") return
        setPicked((prev) => prev.filter((p) => p !== id))
    }

    if (done) {
        const total = score.correct + score.wrong
        const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-beige bg-white py-16 px-6 text-center shadow-sm">
                <Sparkles className="size-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-black text-text-primary">Hoàn thành!</h2>
                <p className="mt-1 text-text-muted">{deckName}</p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Đúng</p><p className="text-2xl font-black text-green-600">{score.correct}</p></div>
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Sai</p><p className="text-2xl font-black text-red-500">{score.wrong}</p></div>
                </div>
                <p className="mt-4 text-lg font-bold text-text-primary">{pct}% chính xác</p>
                <div className="mt-6 flex gap-3">
                    <button onClick={onBack} className="rounded-xl border border-beige bg-white px-6 py-3 text-sm font-semibold text-text-primary hover:bg-cream"><ArrowLeft className="inline size-4 mr-1" /> Chọn mode</button>
                    <button onClick={() => { setIndex(0); setScore({ correct: 0, wrong: 0 }); setDone(false); setPicked([]); setStatus("idle") }} className="rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"><RefreshCw className="inline size-4 mr-1" /> Làm lại</button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <style>{shakeStyle}</style>
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"><ArrowLeft className="size-4" /> Chọn mode</button>
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-text-muted uppercase">Sắp xếp chữ cái</span>
                    <span className="text-sm font-medium text-text-muted">{index + 1} / {notes.length}</span>
                </div>

                <div className="text-center mb-6">
                    {meaning && <p className="text-sm font-semibold text-text-primary">{meaning}</p>}
                    {ipa && <p className="text-xs text-text-muted mt-0.5">{ipa}</p>}
                    {!meaning && !ipa && <p className="text-xs text-text-muted">Sắp xếp chữ cái để tạo thành từ</p>}
                </div>

                <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase text-text-muted mb-2">Chữ cái đã xếp:</p>
                    <div className={`flex flex-wrap gap-2 min-h-[48px] items-center justify-center rounded-xl border-2 p-3 transition-all duration-300 ${status === "correct" ? "border-green-400 bg-green-50" : status === "wrong" ? "border-red-400 bg-red-50" : "border-beige bg-cream/30"}`}
                        style={status === "wrong" ? { animation: "shake 0.4s ease-in-out" } : undefined}>
                        {arranged.length === 0 ? (
                            <span className="text-xs text-text-muted italic">Click vào chữ cái bên dưới để xếp</span>
                        ) : (
                            arranged.map((ch, i) => (
                                <button key={`${picked[i]}-${i}`} onClick={() => unstick(picked[i])}
                                    className={`inline-flex size-9 items-center justify-center rounded-lg text-sm font-bold transition-all hover:opacity-80 ${status === "correct" ? "bg-green-500 text-white" : "bg-terracotta text-white"}`}>
                                    {ch.toUpperCase()}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase text-text-muted mb-2">Chữ cái còn lại (click để chọn):</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {remaining.length === 0 ? (
                            <p className="text-xs text-text-muted italic">Đã xếp hết...</p>
                        ) : (
                            remaining.map((t) => (
                                <button key={t.id} onClick={() => pick(t.id)}
                                    disabled={status !== "idle"}
                                    className="inline-flex size-9 items-center justify-center rounded-lg border-2 border-beige bg-white text-sm font-bold text-text-primary hover:bg-terracotta hover:text-white hover:border-terracotta transition-all disabled:opacity-30">
                                    {t.char.toUpperCase()}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <button onClick={() => { setPicked([]); setStatus("idle") }} className="flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-cream transition-all">
                        <RefreshCw className="size-3.5" /> Reset
                    </button>
                    <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-cream transition-all">
                        <Lightbulb className="size-3.5" /> {showHint ? "Ẩn gợi ý" : "Gợi ý"}
                    </button>
                    {showHint && (
                        <span className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200">
                            {ipa || `${word.length} chữ cái`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
