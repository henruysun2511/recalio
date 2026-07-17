"use client"

import { useState, useMemo } from "react"
import { Check, X, ArrowLeft, RefreshCw } from "lucide-react"

interface Props { notes: any[]; deckName?: string; onBack: () => void }

interface Answer {
    word: string
    yourAnswer: string
    correctAnswer: string
    isCorrect: boolean
    options: string[]
}

export function MultipleChoiceMode({ notes, deckName, onBack }: Props) {
    const [index, setIndex] = useState(0)
    const [selected, setSelected] = useState<string | null>(null)
    const [answers, setAnswers] = useState<Answer[]>([])
    const [done, setDone] = useState(false)
    const note = notes[index]
    const word = note?.word ?? ""
    const correctMeaning = note?.meaning ?? ""

    const options = useMemo(() => {
        if (!note) return []
        const others = notes.filter((n: any) => {
            const m = n?.meaning ?? ""
            return m !== correctMeaning && m.trim()
        }).map((n: any) => n?.meaning ?? "")
        const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3)
        return [...new Set([correctMeaning, ...shuffled])].sort(() => Math.random() - 0.5)
    }, [note, notes])

    const confirm = () => {
        if (!selected) return
        const isCorrect = selected === correctMeaning
        setAnswers((prev) => [...prev, { word, yourAnswer: selected, correctAnswer: correctMeaning, isCorrect, options }])
        setSelected(null)
        if (index >= notes.length - 1) setDone(true)
        else setIndex((i) => i + 1)
    }

    if (done) {
        const total = answers.length
        const correct = answers.filter((a) => a.isCorrect).length
        return (
            <div className="space-y-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"><ArrowLeft className="size-4" /> Chọn mode</button>

                <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm text-center">
                    <h2 className="text-2xl font-black text-text-primary">Hoàn thành!</h2>
                    <p className="mt-1 text-text-muted">{deckName}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                        <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Đúng</p><p className="text-2xl font-black text-green-600">{correct}</p></div>
                        <div className="rounded-2xl border border-beige bg-cream p-4"><p className="text-xs font-medium text-text-muted">Sai</p><p className="text-2xl font-black text-red-500">{total - correct}</p></div>
                    </div>
                    <p className="mt-4 text-lg font-bold text-text-primary">{total > 0 ? Math.round((correct / total) * 100) : 0}% chính xác</p>
                    <div className="mt-6 flex gap-3 justify-center">
                        <button onClick={onBack} className="rounded-xl border border-beige bg-white px-6 py-3 text-sm font-semibold text-text-primary hover:bg-cream"><ArrowLeft className="inline size-4 mr-1" /> Chọn mode</button>
                        <button onClick={() => { setIndex(0); setAnswers([]); setDone(false); setSelected(null) }} className="rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"><RefreshCw className="inline size-4 mr-1" /> Làm lại</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {answers.map((a, i) => (
                        <div key={i} className="rounded-3xl border border-beige bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-bold text-text-muted">Câu {i + 1}</span>
                                {a.isCorrect ? (
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Đúng</span>
                                ) : (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Sai</span>
                                )}
                            </div>
                            <p className="text-sm text-text-muted mb-1">Chọn nghĩa đúng cho:</p>
                            <p className="text-lg font-bold text-text-primary mb-4">{a.word}</p>
                            <div className="space-y-2">
                                {a.options.map((opt, j) => {
                                    const isUserChoice = opt === a.yourAnswer
                                    const isCorrectAns = opt === a.correctAnswer
                                    let cls = "border-beige bg-white"
                                    if (isCorrectAns) cls = "border-green-400 bg-green-50"
                                    if (isUserChoice && !a.isCorrect) cls = "border-red-400 bg-red-50"
                                    return (
                                        <div key={j} className={`rounded-xl border-2 p-3 text-sm font-medium ${cls}`}>
                                            <span className="text-text-muted mr-2">{String.fromCharCode(65 + j)}.</span> {opt}
                                            {isCorrectAns && <Check className="inline size-4 ml-1 text-green-600" />}
                                            {isUserChoice && !a.isCorrect && <X className="inline size-4 ml-1 text-red-500" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"><ArrowLeft className="size-4" /> Chọn mode</button>
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-text-muted uppercase">Trắc nghiệm</span>
                    <span className="text-sm font-medium text-text-muted">{index + 1} / {notes.length}</span>
                </div>
                <div className="min-h-[80px] flex items-center justify-center mb-6">
                    <div className="text-center">
                        <p className="text-xs text-text-muted mb-2">Chọn nghĩa đúng cho:</p>
                        <p className="text-xl font-bold text-text-primary">{word || "(không có từ)"}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {options.map((opt, i) => {
                        const isSelected = selected === opt
                        return (
                            <button key={i} onClick={() => setSelected(opt)}
                                className={`w-full rounded-xl border-2 p-3 text-left text-sm font-medium transition-all ${isSelected ? "border-terracotta bg-terracotta/10" : "border-beige bg-white hover:bg-cream"}`}>
                                <span className="text-text-muted mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                            </button>
                        )
                    })}
                </div>
                {selected && (
                    <button onClick={confirm} className="mt-4 w-full rounded-xl bg-terracotta py-3 text-sm font-bold text-white hover:bg-terracotta-dark">
                        {index >= notes.length - 1 ? "Xem kết quả" : "Xác nhận"}
                    </button>
                )}
            </div>
        </div>
    )
}
