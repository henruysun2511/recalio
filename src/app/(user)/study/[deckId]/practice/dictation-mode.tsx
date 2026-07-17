"use client"

import { useState } from "react"
import { Check, X, ArrowLeft, RefreshCw, Volume2 } from "lucide-react"

interface Props { notes: any[]; deckName?: string; onBack: () => void }

export function DictationMode({ notes, deckName, onBack }: Props) {
    const [index, setIndex] = useState(0)
    const [typed, setTyped] = useState("")
    const [result, setResult] = useState<{ correct: boolean; expected: string } | null>(null)
    const [score, setScore] = useState({ correct: 0, wrong: 0 })
    const [done, setDone] = useState(false)
    const note = notes[index]
    const word = note?.word ?? ""
    const meaning = note?.meaning ?? ""

    const speak = () => {
        if ("speechSynthesis" in window) {
            const u = new SpeechSynthesisUtterance(word)
            u.lang = "en-US"; u.rate = 0.8
            speechSynthesis.cancel()
            speechSynthesis.speak(u)
        }
    }

    const check = () => {
        setResult({ correct: typed.trim().toLowerCase() === word.toLowerCase(), expected: word })
    }

    const next = () => {
        if (result?.correct) setScore((s) => ({ ...s, correct: s.correct + 1 }))
        else setScore((s) => ({ ...s, wrong: s.wrong + 1 }))
        setTyped(""); setResult(null)
        if (index >= notes.length - 1) setDone(true)
        else setIndex((i) => i + 1)
    }

    if (done) {
        const total = score.correct + score.wrong
        const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-beige bg-white py-16 px-6 text-center shadow-sm">
                <h2 className="text-2xl font-black text-text-primary">Hoàn thành!</h2>
                <p className="mt-1 text-text-muted">{deckName}</p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Đúng</p><p className="text-2xl font-black text-green-600">{score.correct}</p></div>
                    <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Sai</p><p className="text-2xl font-black text-red-500">{score.wrong}</p></div>
                </div>
                <p className="mt-4 text-lg font-bold text-text-primary">{pct}% chính xác</p>
                <div className="mt-6 flex gap-3">
                    <button onClick={onBack} className="rounded-xl border border-beige bg-white px-6 py-3 text-sm font-semibold text-text-primary hover:bg-cream"><ArrowLeft className="inline size-4 mr-1" /> Chọn mode</button>
                    <button onClick={() => { setIndex(0); setScore({ correct: 0, wrong: 0 }); setDone(false); setTyped(""); setResult(null) }} className="rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"><RefreshCw className="inline size-4 mr-1" /> Làm lại</button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"><ArrowLeft className="size-4" /> Chọn mode</button>
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-text-muted uppercase">Nghe chép chính tả</span>
                    <span className="text-sm font-medium text-text-muted">{index + 1} / {notes.length}</span>
                </div>
                <div className="min-h-[120px] flex items-center justify-center">
                    <div className="text-center max-w-lg">
                        <p className="text-xs text-text-muted mb-2">Nghe và viết lại:</p>
                        <button onClick={speak} className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta hover:bg-terracotta/20 transition-all active:scale-95">
                            <Volume2 className="size-6" />
                        </button>
                        {meaning && <p className="text-sm text-text-muted italic">{meaning}</p>}
                    </div>
                </div>
                {result ? (
                    <div className="mt-6 space-y-3">
                        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${result.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.correct ? <><Check className="size-5" /> Chính xác!</> : <><X className="size-5" /> Đáp án: <span className="font-black">{result.expected}</span></>}
                        </div>
                        <button onClick={next} className="w-full rounded-xl bg-terracotta py-3 text-sm font-bold text-white hover:bg-terracotta-dark">{index >= notes.length - 1 ? "Xem kết quả" : "Tiếp theo"}</button>
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        <input value={typed} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") check() }}
                            placeholder="Viết lại từ..." className="h-12 w-full rounded-xl border-2 border-beige bg-white px-4 text-sm font-medium text-text-primary focus:border-terracotta focus:outline-none" autoFocus />
                        <button onClick={check} disabled={!typed.trim()} className="w-full rounded-xl bg-terracotta py-3 text-sm font-bold text-white hover:bg-terracotta-dark disabled:opacity-50">Kiểm tra</button>
                    </div>
                )}
            </div>
        </div>
    )
}
