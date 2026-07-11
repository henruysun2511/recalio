"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle2, EyeOff, Ban, Check, X as XIcon } from "lucide-react"
import { useDueCards, useCardsByDeck } from "@/queries/useCardQuery"
import { useCreateSession, useEndSession, useReviewLogs } from "@/queries/useStudySessionQuery"
import { useReviewCard, useSuspendCard, useBuryCard } from "@/queries/useCardQuery"
import { useDeck } from "@/queries/useDeckQuery"
import { ReviewRating } from "@/constants/type"
import { handleError } from "@/utils/handleError"
import type { ReviewCardInput } from "@/schemas/card.schema"

type Phase = "loading" | "studying" | "done"

const ratingConfig = [
    { rating: ReviewRating.AGAIN, label: "Again", sub: "Quên — làm lại", color: "bg-red-500 hover:bg-red-600" },
    { rating: ReviewRating.HARD, label: "Hard", sub: "Nhớ nhưng khó", color: "bg-orange-500 hover:bg-orange-600" },
    { rating: ReviewRating.GOOD, label: "Good", sub: "Nhớ — bình thường", color: "bg-green-500 hover:bg-green-600" },
    { rating: ReviewRating.EASY, label: "Easy", sub: "Rất dễ — bỏ qua", color: "bg-blue-500 hover:bg-blue-600" },
]

function buildFieldMap(card: any): Record<string, string> {
    const audioUrl = card?.note?.audioUrl ?? ""
    const imageUrl = card?.note?.imageUrl ?? ""
    return {
        Word: card?.note?.word ?? "",
        Meaning: card?.note?.meaning ?? "",
        IPA: card?.note?.ipa ?? "",
        PartOfSpeech: card?.note?.partOfSpeech ?? "",
        Example: card?.note?.example ?? "",
        Front: card?.note?.word ?? "",
        Back: card?.note?.meaning ?? "",
        Text: card?.note?.word ?? "",
        Extra: card?.note?.example ?? "",
        Image: imageUrl ? `<img src="${imageUrl}" class="card-image" />` : "",
        Audio: audioUrl ? `<button onclick="new Audio('${audioUrl}').play()" class="card-audio-btn">🔊 Nghe</button>` : "",
    }
}

function hasTypeMarker(html: string): boolean {
    return /{{type:([^}]+)}}/i.test(html)
}

function processBackHtml(html: string, fieldMap: Record<string, string>): string {
    let result = html
    for (const [key, val] of Object.entries(fieldMap)) {
        result = result.replaceAll(`{{${key}}}`, val)
    }
    result = result.replace(/{{type:([^}]+)}}/gi, (_, field) => {
        const expected = fieldMap[field.trim()] || ""
        return `<span class="font-bold text-terracotta">${expected}</span>`
    })
    result = result.replace(/{{cloze:([^}]+)}}/gi, (_, field) => {
        const value = fieldMap[field.trim()] || ""
        return `<span class="font-bold text-terracotta">${value}</span>`
    })
    result = result.replace(/<hr id="answer"\s*\/?>/gi, '<hr class="my-3 border-beige" />')
    return result
}

function CardPreview({ card, compact }: { card: any; compact?: boolean }) {
    const [showBack, setShowBack] = useState(false)
    const fieldMap = useMemo(() => buildFieldMap(card), [card])
    const backHtml = useMemo(() => processBackHtml(card?.backHtml ?? "", fieldMap), [card, fieldMap])
    return (
        <div
            onClick={() => setShowBack((v) => !v)}
            className={`relative cursor-pointer rounded-xl border border-beige bg-white shadow-sm transition-all hover:shadow-md [perspective:1000px] ${compact ? "min-h-[120px]" : "min-h-[160px]"}`}
        >
            <div className={`relative w-full ${compact ? "min-h-[100px]" : "min-h-[140px]"} transition-transform duration-500 [transform-style:preserve-3d] ${showBack ? "[transform:rotateY(180deg)]" : ""}`}>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden]">
                    <div
                        className={`w-full text-center [&_img]:max-h-24 [&_img]:rounded-lg [&_img]:object-cover ${compact ? "text-xs" : "text-sm"}`}
                        dangerouslySetInnerHTML={{ __html: card?.frontHtml ?? "" }}
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div
                        className={`w-full text-center [&_img]:max-h-24 [&_img]:rounded-lg [&_img]:object-cover ${compact ? "text-xs" : "text-sm"}`}
                        dangerouslySetInnerHTML={{ __html: backHtml }}
                    />
                </div>
            </div>
        </div>
    )
}

const RATING_BADGES: Record<string, { label: string; color: string }> = {
    AGAIN: { label: "Again", color: "bg-red-100 text-red-700" },
    HARD: { label: "Hard", color: "bg-orange-100 text-orange-700" },
    GOOD: { label: "Good", color: "bg-green-100 text-green-700" },
    EASY: { label: "Easy", color: "bg-blue-100 text-blue-700" },
}

export default function StudySessionPage() {
    const { deckId } = useParams<{ deckId: string }>()
    const router = useRouter()
    const { data: deckRes } = useDeck(deckId)
    const { data: cardsRes, isLoading: cardsLoading } = useDueCards({ deckId, page: 1, limit: 200 })
    const createSession = useCreateSession()
    const endSession = useEndSession()
    const reviewCard = useReviewCard()
    const suspendCard = useSuspendCard()
    const buryCard = useBuryCard()
    const deck = (deckRes as any)?.data

    const [allCards, setAllCards] = useState<any[]>([])
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [completedSessionId, setCompletedSessionId] = useState<string | null>(null)
    const { data: logsData, isLoading: logsLoading } = useReviewLogs(completedSessionId ?? "")
    const { data: allDeckCardsData } = useCardsByDeck(deckId, { page: 1, limit: 200 })
    const deckCards = (allDeckCardsData as any)?.data ?? []
    const [phase, setPhase] = useState<Phase>("loading")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [stats, setStats] = useState({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 })
    const [submitting, setSubmitting] = useState(false)
    const [typedAnswer, setTypedAnswer] = useState("")
    const [answerResult, setAnswerResult] = useState<{ correct: boolean; expected: string } | null>(null)
    const initializedRef = useRef(false)
    const sessionStartedRef = useRef(false)
    const sessionIdRef = useRef<string | null>(null)
    const startTimeRef = useRef(0)
    const inputRef = useRef<HTMLInputElement>(null)

    const currentCard = allCards[currentIndex]
    const isLastCard = currentIndex >= allCards.length - 1

    const fieldMap = useMemo(() => buildFieldMap(currentCard), [currentCard])
    const isTypeAnswer = useMemo(() => hasTypeMarker(currentCard?.backHtml ?? ""), [currentCard])
    const processedBackHtml = useMemo(() => processBackHtml(currentCard?.backHtml ?? "", fieldMap), [currentCard, fieldMap])

    const startSession = useCallback(async () => {
        if (sessionStartedRef.current) return
        sessionStartedRef.current = true
        try {
            const res = await createSession.mutateAsync({ deckId })
            const session = (res as any)?.data
            if (session?.id) {
                setSessionId(session.id)
                sessionIdRef.current = session.id
            }
        } catch (err) {
            handleError(err, "Không thể bắt đầu phiên học")
            router.push("/study")
        }
    }, [deckId, createSession])

    useEffect(() => {
        if (initializedRef.current) return
        if (cardsLoading || cardsRes === undefined) return
        const dueCards = ((cardsRes as any)?.data || []) as any[]
        initializedRef.current = true
        if (dueCards.length === 0) {
            setPhase("done")
        } else {
            setAllCards(dueCards)
            startTimeRef.current = performance.now()
            startSession().then(() => setPhase("studying"))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardsLoading, cardsRes])

    const handleFlip = () => {
        if (!flipped) {
            setFlipped(true)
            setTypedAnswer("")
            setAnswerResult(null)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    const handleRating = async (rating: ReviewRating) => {
        if (submitting || !currentCard || !flipped) return
        setSubmitting(true)

        if (isTypeAnswer && !answerResult) {
            const typeFieldName = "Text"
            const expected = fieldMap[typeFieldName] || ""
            const correct = typedAnswer.trim().toLowerCase() === expected.trim().toLowerCase()
            setAnswerResult({ correct, expected })
            setSubmitting(false)
            return
        }

        const responseTimeMs = Math.round(performance.now() - startTimeRef.current)
        const data: ReviewCardInput = { rating, responseTimeMs }
        if (sessionIdRef.current) data.sessionId = sessionIdRef.current

        try {
            await reviewCard.mutateAsync({ id: currentCard.id, data })
            setStats((prev) => ({
                ...prev,
                reviewed: prev.reviewed + 1,
                [rating.toLowerCase() as keyof typeof prev]: prev[rating.toLowerCase() as keyof typeof prev] + 1,
            }))

            if (isLastCard) {
                if (sessionIdRef.current) {
                    await endSession.mutateAsync(sessionIdRef.current)
                    setCompletedSessionId(sessionIdRef.current)
                }
                setPhase("done")
            } else {
                setCurrentIndex((i) => i + 1)
                setFlipped(false)
                setTypedAnswer("")
                setAnswerResult(null)
                startTimeRef.current = performance.now()
            }
        } catch (err) {
            handleError(err, "Ghi nhận kết quả thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSkip = async (action: "bury" | "suspend") => {
        if (!currentCard || submitting) return
        setSubmitting(true)
        try {
            if (action === "bury") {
                await buryCard.mutateAsync(currentCard.id)
            } else {
                await suspendCard.mutateAsync(currentCard.id)
            }
            if (isLastCard) {
                if (sessionIdRef.current) {
                    await endSession.mutateAsync(sessionIdRef.current)
                    setCompletedSessionId(sessionIdRef.current)
                }
                setPhase("done")
            } else {
                setCurrentIndex((i) => i + 1)
                setFlipped(false)
                setTypedAnswer("")
                setAnswerResult(null)
                startTimeRef.current = performance.now()
            }
        } catch (err) {
            handleError(err, "Thao tác thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    if (phase === "loading") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (phase === "done") {
        const total = stats.reviewed
        const accuracy = total > 0 ? Math.round(((stats.good + stats.easy) / total) * 100) : 0
        const logs = (logsData as any)?.data ?? []
        return (
            <div className="space-y-6">
                <button onClick={() => router.push("/study")} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary">
                    <ArrowLeft className="size-4" /> Quay lại
                </button>

                {/* Completion header */}
                <div className="flex flex-col items-center justify-center rounded-3xl border border-beige bg-white py-12 px-6 text-center shadow-sm">
                    <CheckCircle2 className="size-14 text-green-500 mb-3" />
                    <h2 className="text-2xl font-black text-text-primary">Hoàn thành!</h2>
                    <p className="mt-1 text-text-muted">Bạn đã ôn tập xong bộ thẻ này</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm">
                        <div className="rounded-2xl border border-beige bg-cream p-4">
                            <p className="text-xs font-medium text-text-muted">Đã ôn</p>
                            <p className="text-2xl font-black text-text-primary">{total}</p>
                        </div>
                        <div className="rounded-2xl border border-beige bg-cream p-4">
                            <p className="text-xs font-medium text-text-muted">Chính xác</p>
                            <p className="text-2xl font-black text-green-600">{accuracy}%</p>
                        </div>
                    </div>
                </div>

                {/* Review logs — card preview + rating annotation */}
                {completedSessionId && (
                    <div>
                        <h3 className="mb-4 text-sm font-black text-text-primary tracking-tight">
                            Chi tiết ôn tập
                        </h3>
                        {logsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="size-6 animate-spin text-terracotta" />
                            </div>
                        ) : logs.length === 0 ? (
                            <p className="text-sm text-text-muted text-center py-8">Chưa có dữ liệu ôn tập.</p>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log: any) => {
                                    const badge = RATING_BADGES[log.rating] ?? { label: log.rating, color: "bg-gray-100 text-gray-700" }
                                    return (
                                        <div key={log.id} className="rounded-2xl border border-beige bg-white p-4 shadow-sm space-y-3">
                                            <CardPreview card={log.card} />
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badge.color}`}>{badge.label}</span>
                                                {log.responseTimeMs != null && (
                                                    <span className="text-xs text-text-muted">{log.responseTimeMs}ms</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* All deck cards */}
                <div>
                    <h3 className="mb-4 text-sm font-black text-text-primary tracking-tight">
                        Tất cả thẻ trong deck ({deckCards.length})
                    </h3>
                    {deckCards.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-8">Chưa có thẻ nào.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {deckCards.map((card: any) => (
                                <CardPreview key={card.id} card={card} compact />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => router.push("/study")} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary">
                    <ArrowLeft className="size-4" /> {deck?.name || "Học tập"}
                </button>
                <span className="text-sm font-medium text-text-muted">
                    {currentIndex + 1} / {allCards.length}
                </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-beige overflow-hidden">
                <div
                    className="h-full rounded-full bg-terracotta transition-all duration-300"
                    style={{ width: `${(currentIndex / allCards.length) * 100}%` }}
                />
            </div>

            <div
                onClick={handleFlip}
                className="relative min-h-[320px] cursor-pointer rounded-3xl border border-beige bg-white shadow-sm transition-all hover:shadow-md [perspective:1000px]"
            >
                <div className={`relative w-full min-h-[280px] transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
                        <div
                            className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
                            dangerouslySetInnerHTML={{ __html: currentCard?.frontHtml || "" }}
                        />
                        <style>{currentCard?.css}</style>
                        <p className="mt-6 text-xs font-medium text-text-muted">Chạm để lật thẻ</p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div
                            className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
                            dangerouslySetInnerHTML={{ __html: processedBackHtml }}
                        />
                        <style>{currentCard?.css}</style>
                        {isTypeAnswer && answerResult && (
                            <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                                answerResult.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {answerResult.correct ? (
                                    <><Check className="size-4" /> Chính xác!</>
                                ) : (
                                    <><XIcon className="size-4" /> Đáp án: <span className="font-black">{answerResult.expected}</span></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {flipped && (
                <div className="space-y-2">
                    {isTypeAnswer && !answerResult && (
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={typedAnswer}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleRating(ReviewRating.GOOD) }}
                                placeholder="Gõ đáp án của bạn..."
                                className="h-12 flex-1 rounded-xl border-2 border-beige bg-white px-4 text-sm font-medium text-text-primary focus:border-terracotta focus:outline-none"
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => handleSkip("bury")}
                            disabled={submitting}
                            className="group relative flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:bg-cream hover:text-text-primary disabled:opacity-50"
                            title="Ẩn thẻ đến hết ngày"
                        >
                            <EyeOff className="size-3.5" />
                            Ẩn
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                hết ngày
                            </span>
                        </button>
                        <button
                            onClick={() => handleSkip("suspend")}
                            disabled={submitting}
                            className="group relative flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:bg-cream hover:text-text-primary disabled:opacity-50"
                            title="Tạm dừng thẻ vĩnh viễn"
                        >
                            <Ban className="size-3.5" />
                            Tạm dừng
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                vĩnh viễn
                            </span>
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                    {ratingConfig.map((cfg) => (
                        <button
                            key={cfg.rating}
                            onClick={() => handleRating(cfg.rating)}
                            disabled={submitting}
                            className={`rounded-xl py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${cfg.color}`}
                        >
                            {submitting ? (
                                <Loader2 className="mx-auto size-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="block">{cfg.label}</span>
                                    <span className="block text-[10px] font-normal opacity-80">{cfg.sub}</span>
                                </>
                            )}
                        </button>
                    ))}
                </div>
                </div>
            )}

            {!flipped && (
                <p className="text-center text-xs text-text-muted">
                    Nhấn Space hoặc chạm để lật thẻ
                </p>
            )}
            {flipped && !answerResult && (
                <p className="text-center text-xs text-text-muted">
                    {isTypeAnswer ? "Gõ đáp án, Enter để kiểm tra" : "Phím 1-4 để đánh giá"}
                </p>
            )}
            {flipped && answerResult && (
                <p className="text-center text-xs text-text-muted">
                    Phím 1-4 để đánh giá
                </p>
            )}

            {/* All deck cards reference */}
            <div className="pt-4 border-t border-beige">
                <details className="group">
                    <summary className="cursor-pointer text-sm font-bold text-text-primary tracking-tight list-none flex items-center gap-2">
                        <span>Tất cả thẻ trong deck</span>
                        <span className="text-xs font-normal text-text-muted">({deckCards.length})</span>
                    </summary>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {deckCards.map((card: any) => (
                            <CardPreview key={card.id} card={card} compact />
                        ))}
                    </div>
                </details>
            </div>
        </div>
    )
}

